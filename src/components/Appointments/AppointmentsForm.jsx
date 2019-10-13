import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css'

import {
  Checkbox
} from 'bloomer';

import {
  Field,
  Select,
  DateTimePicker,
  Text
} from 'shipnow-mercurio';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

import startCase from 'lodash/startCase';

import { horarios } from '../../lib/Mocks';

import moment from 'moment';

@observer
class AppointmentsForm extends Component {
  constructor(props) {
    super(props);

    this.handleProfessional = this.handleProfessional.bind(this);
    this.handleServices      = this.handleServices.bind(this);
    this.handleDate         = this.handleDate.bind(this);
    this.handleHour         = this.handleHour.bind(this);

    this.state = {
      professionals: null,
      professional: null,
      services: [],
      subtotal: 0,
      date: moment()
    }
  }

  componentDidMount() {
    this.setState({
      professionals: this.props.store.professionals.getAll(),
    })
  }

  handleHour( sender, value, name ) {
    this.props.onChange && this.props.onChange('hour', value);
  }

  handleDate( sender, value, name ) {
    this.setState({
      date: value
    })
    this.props.onChange && this.props.onChange('date', value);
  }

  handleProfessional( sender, value, name ) {
    this.setState({
      professional: value,
    });
    this.props.onChange && this.props.onChange('professional', value.id)
  }

  handleServices( serviceId, servicePrice ) {
    let newArray = Array.from(this.state.services)
    if(newArray.includes(serviceId)){
      newArray = newArray.filter(item => item !== serviceId)
      this.setState({
        subtotal: this.state.subtotal - servicePrice,
      });
    }else{
      newArray.push(serviceId)
      this.setState({
        subtotal: this.state.subtotal + servicePrice,
      });
    }
    this.setState({
      services: newArray,
    });
    this.props.onChange && this.props.onChange('services', newArray)
  }
  

  render() {
    if (!this.state.professionals || !this.state.professionals.isOk()) {
      return null;
    }
    const { professionals } = this.state; 
    const { appointment } = this.props;
    return(
      <React.Fragment>
        { !this.props.withDate &&
          <Field className="ml-5" label="¿Que día querés venir?" labelNote="Seleccioná ua fecha">
            <DateTimePicker key={ this.state.date } value={ this.state.date } onChange={ this.handleDate }/>
          </Field> }
        <Field className="ml-5" label="¿A cual de nuestras sucursales querés venir?" labelNote="Seleccioná una sucursal">
          <Select 
            disabled
            placeholder="Sucursales" 
            borderless 
            icon={ faChevronDown } 
            options={ [] } />
        </Field>
        <Field className="ml-5" label="¿Por quién querés ser atendido?" labelNote="Seleccioná un profesional">
          <Select 
            placeholder="Profesionales" 
            borderless 
            icon={ faChevronDown } 
            onChange={ this.handleProfessional }
            options={ professionals.toArray().map( prof => ({ key: `${ startCase(prof.name) } ${ startCase(prof.lastName) }`, value: prof })) } />
        </Field>
        <Field className="ml-5" label="¿Cuál de nuestros servicios precisas?" labelNote="Seleccioná un servicio">
            {this.state.professional && this.state.professional.services.map(serv => (
              <Checkbox className="ml-2 pt-1" isFullWidth onClick={() => this.handleServices(serv.id, serv.price)} ><Text className="pl-1">{`${ startCase(serv.name) } - $${ serv.price }`}</Text></Checkbox>
            ))}
            {this.state.subtotal !==0 && <Text className="has-text-centered ml-2" weight="medium" color="primaryDark"><hr id="subtotalLine"/>Subtotal: ${this.state.subtotal}</Text>}
        </Field>
        <Field className="ml-5" label="¿A qué hora querés venir?" labelNote="Seleccioná un horario">
          <Select 
            maxHeight="150px" 
            placeholder="Horarios" 
            borderless 
            icon={ faChevronDown }
            onChange={ this.handleHour } 
            options={ horarios() }/>
        </Field>
      </React.Fragment> )
  }
}

AppointmentsForm.PropTypes = {
  withDate: PropTypes.bool,
  appointment: PropTypes.object,
}

AppointmentsForm.defaultProps = {
  withDate: false,
  appointment: null,
}

export default withStore(AppointmentsForm);