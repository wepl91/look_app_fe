import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Field,
  Select,
  DateTimePicker,
  Text
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
    this.handleService      = this.handleService.bind(this);
    this.handleDate         = this.handleDate.bind(this);
    this.handleHour         = this.handleHour.bind(this);

    this.state = {
      professionals: null,
      professional: this.props.appointment ? this.props.appointment.professional : 'null',
      services: null,
      date: moment()
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
      debugger
      this.props.onChange && this.props.onChange('professional', value);
    }
  }

  handleService( sender, value, name ) {
    this.setState({
      service: value,
    });
    this.props.onChange && this.props.onChange('services', value.id);
  }

  getProfessionalList() {
    const prof = [];
    prof.push({key: '- Ninguno -', value: 'null'});

    this.state.professionals.toArray().forEach(element => {
      prof.push({ key: `${ startCase(element.name) } ${ startCase(element.lastName) }`, value: element.id })
    });

    return prof
  }

  renderServices() {
    const { professional } = this.state;
    const services = professional && professional != 'null' ?  professional.services : this.state.services.toArray();
    return(
      <Field className="ml-5" label="¿Cual de nuestros servicios requeris?" labelNote="Seleccioná un servicio">
        { services.length > 0 ? 
          services.map( service => ( <Checkbox key={ service.id } className="mt-1" isFullWidth defaultChecked={ false } >
                                      <Text className="ml-1">{`${ startCase(service.name) } - $${ service.price }`}</Text>
                                    </Checkbox> )) : 
          <Text size="md" weight="medium" className="ml-2 mt-1">No hay servicios existentes para ofrecer.</Text> }
      </Field> )
  }

  render() {
    const professionalsLoaded = this.state.professionals && this.state.professionals.isOk();
    const servicesLoaded = this.state.services && this.state.services.isOk()
    if (!professionalsLoaded || !servicesLoaded) {
      return null;
    }

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
            key={ this.state.professional }
            value={ this.state.professional.id || this.state.professional }
            placeholder="Profesionales" 
            borderless 
            icon={ faChevronDown } 
            onChange={ this.handleProfessional }
            options={ this.getProfessionalList() } />
        </Field>
        { this.renderServices() } 
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
  appointment: PropTypes.object,
}

AppointmentsForm.defaultProps = {
  withDate: false,
  appointment: null,
}

export default withStore(AppointmentsForm);