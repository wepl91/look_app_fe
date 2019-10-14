import React, { Component } from 'react';

import {
  Column,
  Columns,
  Level,
  LevelLeft,
  LevelRight
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
@observer
class AppointmentCreation extends Component {
  
  newAppointment
  
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
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

  handleClick() {
    const { toastManager } = this.props;
    this.setState({
      isSaving: true
    }, () => {
      this.newAppointment.save().andThen( (savedAppointment, responseError) => {
        if (responseError) {
          if (this.isProfessionalBusyMsj(responseError)) {
            toastManager.add("Ups! Parece que hubo problema! El profesional seleccionado se encuentra ocupado en el horario en el que se quiere crear el turno!", {
              appearance: 'error',
              autoDismiss: true,
              pauseOnHover: false,
            });
          }
          else {
            toastManager.add("Ups! Parece que hubo un error al guardar los cambios!", {
              appearance: 'error',
              autoDismiss: true,
              pauseOnHover: false,
            });
          } 
        }
        else {
          toastManager.add("El turno se reservó exitosamente!", {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
        }
        this.props.history.push('appointments/list');
      })
    })
  }
  

  handleChange( name, value ) {
    if (name == 'hour') {
      this.newAppointment.dayHour.hour(value);
      this.newAppointment.dayHour.minute(0);
      this.newAppointment.dayHour.second(0);
    }
    else if (name == 'date') {
      this.newAppointment.dayHour.year(value.get('year'));
      this.newAppointment.dayHour.date(value.get('date'));  
    }
    else {
      this.newAppointment[name] = value
    }
    this.setState({
      loaded: !this.state.loaded
    })
  }

  render() {
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Nuevo turno</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column isSize={ 5 } className="pl-5">
            <br />
            <br />
            <AppointmentsForm appointment={ this.newAppointment } onChange={ this.handleChange }/>
            <Button className="ml-5 mt-5" onClick={ this.handleClick } kind="outline">Reservar turno</Button>
          </Column>
          <Column isSize={ 7 } className="has-text-right">
            <SvgDraw style={{ height: '500px', width: '500px', marginRight: '100px', marginTop: '-25px'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withRouter(withToastManager(withStore(AppointmentCreation))) ;