import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Field,
  Select,
  DateTimePicker
} from 'shipnow-mercurio';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

import startCase from 'lodash/startCase';

import { horarios } from '../../lib/Mocks';

@observer
class AppointmentsForm extends Component {
  constructor(props) {
    super(props);

    this.handleProfessional = this.handleProfessional.bind(this);
    this.handleService      = this.handleService.bind(this);
    this.handleDate         = this.handleDate.bind(this);
    this.handleHour         = this.handleHour.bind(this);

    this.state = {
      professionals: null,
      professional: null,
      service: null,
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
    this.props.onChange && this.props.onChange('date', value);
  }

  handleProfessional( sender, value, name ) {
    this.setState({
      professional: value,
    });
    this.props.onChange && this.props.onChange('professional', value.id)
  }

  handleService( sender, value, name ) {
    this.setState({
      service: value,
    });
    this.props.onChange && this.props.onChange('services', value.id);
  }
  

  render() {
    if (!this.state.professionals || !this.state.professionals.isOk()) {
      return null;
    }
    const { professionals } = this.state; 
    return(
      <React.Fragment>
        { !this.props.withDate &&
          <Field className="ml-5" label="¿Que día querés venir?" labelNote="Seleccioná ua fecha">
            <DateTimePicker onChange={ this.handleDate }/>
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
        <Field className="ml-5" label="¿Cual de nuestros servicios requeris?" labelNote="Seleccioná un servicio">
          <Select 
            key={ this.state.professional }
            placeholder="Servicios" 
            borderless 
            icon={ faChevronDown } 
            onChange={ this.handleService  }
            options={ this.state.professional && this.state.professional.services.map( service => ( {key: `${ startCase(service.name) }`, value: service} )) } />
        </Field>
        <Field className="ml-5" label="¿A que hora querés venir?" labelNote="Seleccioná un horario">
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
}

AppointmentsForm.defaultProps = {
  withDate: false
}

export default withStore(AppointmentsForm);