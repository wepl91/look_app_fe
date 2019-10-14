import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css'

import {
  Field,
  Select,
  DateTimePicker,
  Text,
  Panel,
} from 'shipnow-mercurio';

import {
  Checkbox
} from 'bloomer';

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
      professional: this.props.appointment ? this.props.appointment.professional : 'null',
      services: null,
      date: this.props.appointment ? this.props.appointment.dayHour : moment()
      selectedServices: [],
      subtotal: 0,
    }
  }

  componentDidMount() {
    this.setState({
      professionals: this.props.store.professionals.getAll(),
      services: this.props.store.services.getAll(),
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
    if (value == 'null') {
      this.setState({
        professional: null,
      });
      this.props.onChange && this.props.onChange('professional', null);
    }
    else {
      const professional = this.state.professionals.toArray().find( professional => {
        return professional.id == value;
      })
      this.setState({
        professional: professional,
      });
      this.props.onChange && this.props.onChange('professional', value);
    }
  }

  handleServices( serviceId, servicePrice ) {
    let newArray = Array.from(this.state.selectedServices)
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
      selectedServices: newArray,
    });
    this.props.onChange && this.props.onChange('services', newArray)
  }

  getProfessionalList() {
    const prof = [];
    prof.push({key: '- Ninguno -', value: 'null'});

    this.state.professionals.toArray().forEach(element => {
      prof.push({ key: `${ startCase(element.name) } ${ startCase(element.lastName) }`, value: element.id })
    });

    return prof
  }

  isServiceInAppointment( serviceID ) {
    const { appointment } = this.props;
    let ret = false;
    if (!appointment) {
      return ret;
    }
    appointment.services.forEach( service => {
      if (service.id == serviceID) {
        ret = true;
      }
    });
    return ret;
  }

  renderServices() {
    const { professional } = this.state;
    const services = professional && professional != 'null' ?  professional.services : this.state.services.toArray();
    return(
      <Field className="ml-5" label="¿Cuál de nuestros servicios requerís?" labelNote="Seleccioná un servicio">
        { services.length > 0 ? 
          services.map( service => ( <Checkbox key={ service.id } className="mt-1" isFullWidth defaultChecked={ false } onClick={() => this.handleServices(service.id, service.price)}>
                                      <Text className="ml-2 pt-1">{`${ startCase(service.name) } - $${ service.price }`}</Text>
                                    </Checkbox> )) : 
          <Text size="md" weight="medium" className="ml-2 mt-1">No hay servicios existentes para ofrecer.</Text> }
        {this.state.subtotal !==0 && <Text className="has-text-centered ml-2" weight="medium" color="primaryDark"><hr id="subtotalLine"/>Subtotal: ${this.state.subtotal}</Text>}
      </Field> )
  }

  renderAdvise() {
    return(
      <Panel className="has-text-centered mr-3 mt-1" invert color="error" style={{ padding: '2px' }}>
        <Text size="sm" weight="medium">La fecha seleccionada es un día no laboral.</Text>
      </Panel> )
  }

  renderSkeleton() {
    return(
    <React.Fragment>
      <Field className="ml-5" label="¿Que día querés venir?" labelNote="Seleccioná ua fecha">
        <DateTimePicker className="is-fullwidth" disabled/>
      </Field>
      <Field className="ml-5" label="¿A cual de nuestras sucursales querés venir?" labelNote="Seleccioná una sucursal">
        <Select 
          disabled
          placeholder="Sucursales" 
          borderless 
          icon={ faChevronDown } 
          disabled
          loading />
      </Field>
      <Field className="ml-5" label="¿Por quién querés ser atendido?" labelNote="Seleccioná un profesional">
        <Select 
          placeholder="Profesionales" 
          borderless 
          icon={ faChevronDown } 
          disabled
          loading />
      </Field>
      <Field className="ml-5" label="¿Cual de nuestros servicios requeris?" labelNote="Seleccioná un servicio">
        <Checkbox className="mt-1" isFullWidth defaultChecked={ false } >
          <Text className="ml-1">...</Text>
        </Checkbox>
        <Checkbox className="mt-1" isFullWidth defaultChecked={ false } >
          <Text className="ml-1">...</Text>
        </Checkbox>
        <Checkbox className="mt-1" isFullWidth defaultChecked={ false } >
          <Text className="ml-1">...</Text>
        </Checkbox> 
      </Field>
      <Field className="ml-5" label="¿A que hora querés venir?" labelNote="Seleccioná un horario">
        <Select 
          maxHeight="120px" 
          placeholder="Horarios" 
          borderless 
          icon={ faChevronDown }
          disabled
          loading/>
      </Field>
    </React.Fragment>)
  }

  render() {
    const professionalsLoaded = this.state.professionals && this.state.professionals.isOk();
    const servicesLoaded = this.state.services && this.state.services.isOk()
    
    if (!professionalsLoaded || !servicesLoaded) {
      return this.renderSkeleton();
    }

    const { appointment } = this.props;
    return(
      <React.Fragment>
        { !this.props.withDate &&
          <Field className="ml-5" label="¿Que día querés venir?" labelNote="Seleccioná ua fecha">
            <DateTimePicker 
              className="is-fullwidth"
              key={ this.state.date } 
              value={ this.state.date } 
              onChange={ this.handleDate }/>
            { this.state.date.isoWeekday() == 7 && this.renderAdvise() }
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
            key={ this.state.professional }
            value={ this.state.professional ? this.state.professional.id : 'null' }
            placeholder="Profesionales" 
            borderless 
            icon={ faChevronDown } 
            onChange={ this.handleProfessional }
            options={ this.getProfessionalList() } />
        </Field>
        { this.renderServices() } 
        <Field className="ml-5" label="¿A que hora querés venir?" labelNote="Seleccioná un horario">
          <Select 
            maxHeight="120px" 
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