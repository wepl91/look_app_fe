import React, { Component } from 'react';

import {
  Column,
  Columns,
  Level,
  LevelLeft
} from 'bloomer';

import {
  Title,
  Button
} from 'shipnow-mercurio';

import { Appointment } from '../../models';

import { ReactComponent as SvgDraw } from '../../assets/undraw_booking_33fn.svg';

import { AppointmentsForm } from '../../components/Appointments';

import moment from 'moment';

import { observer } from 'mobx-react';

import { withStore } from '../../hocs';
import { withToastManager } from 'react-toast-notifications';
import { withRouter } from 'react-router';

import { translate } from '../../lib/Translator';
@observer
class AppointmentCreation extends Component {
  
  newAppointment
  
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      areHoursSelected: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClick  = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.newAppointment = new Appointment({}, this.props.store.appointments);
    this.newAppointment.dayHour = moment();

    this.setState({
      loaded: !this.state.loaded,
    })
  }

  isProfessionalBusyMsj( responseError ) {
    const errorMsj = responseError.message
    return errorMsj && JSON.parse(errorMsj).message && JSON.parse(errorMsj).message == 'professional is busy';
  }

  allProfessionalsBusyMsj( responseError ) {
    const errorMsj = responseError.message
    return errorMsj && JSON.parse(errorMsj).message && JSON.parse(errorMsj).message == 'there are no free professionals';
  }

  handleClick() {
    const { toastManager } = this.props;
    this.setState({
      isSaving: true
    }, () => {
      this.newAppointment.save().andThen( (savedAppointment, responseError) => {
        if (responseError) {
          if (this.isProfessionalBusyMsj(responseError)) {
            toastManager.add(this.getText('Ups! Parece que hubo problema! El profesional seleccionado se encuentra ocupado en el horario en el que se quiere crear el turno!'), {
              appearance: 'error',
              autoDismiss: true,
              pauseOnHover: false,
            });
          }else
          if (this.allProfessionalsBusyMsj(responseError)) {
            toastManager.add(this.getText('Ups! Parece que hubo problema! No hay profesionales que puedan atender en ese horario!'), {
              appearance: 'error',
              autoDismiss: true,
              pauseOnHover: false,
            });
          }
          else {
            toastManager.add(this.getText('Ups! Parece que hubo un error al guardar los cambios!'), {
              appearance: 'error',
              autoDismiss: true,
              pauseOnHover: false,
            });
          } 
        }
        else {
          if(savedAppointment.client) {
            savedAppointment.sendCreationEmail();
          }
          toastManager.add(this.getText('El turno se reservó exitosamente!'), {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
        }
        this.props.history.push('list');
      })
    })
  }
  
  handleChange( name, value ) {
    if (name == 'professional'){
      this.setState({
        areHoursSelected: false
      }) 
    }
    if (name == 'hour') {
      this.newAppointment.dayHour.hour(value.substring(0, 2));
      this.newAppointment.dayHour.minute(0);
      this.newAppointment.dayHour.second(0);
      this.setState({
        areHoursSelected: true
      })
    }
    else if (name == 'date') {
      this.newAppointment.dayHour.year(value.get('year'));
      this.newAppointment.dayHour.date(value.get('date'));
      this.setState({
        areHoursSelected: false
      })  
    }
    else {
      this.newAppointment[name] = value
    }
    this.setState({
      loaded: !this.state.loaded
    })
  }

  getDisabled() {
    return this.newAppointment && !(this.newAppointment.services.length > 0 && this.state.areHoursSelected)
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{ this.getText('Nuevo turno') }</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column isSize={ 5 } className="pl-5">
            <br />
            <br />
            <AppointmentsForm appointment={ this.newAppointment } onChange={ this.handleChange } withDate={ true }/>
            <Button className="ml-5 mt-5" onClick={ this.handleClick } kind="outline" disabled={ this.getDisabled() }>{ this.getText('Reservar turno') }</Button>
          </Column>
          <Column isSize={ 7 } className="has-text-right">
            <SvgDraw style={{ height: '500px', width: '500px', marginRight: '100px', marginTop: '-25px'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withRouter(withToastManager(withStore(AppointmentCreation))) ;