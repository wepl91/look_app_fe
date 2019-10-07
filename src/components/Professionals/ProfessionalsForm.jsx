import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Column,
  Columns,
  Level,
  LevelLeft,
  Checkbox
} from 'bloomer';

import {
  Button,
  Select,
  Field,
  TextInput,
  Title,
  Text,
  Panel
} from 'shipnow-mercurio';

import { WorkingHoursSelector } from './';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { servicios, sucursales } from '../../lib/Mocks';

import startCase from 'lodash/startCase';

import { withStore } from '../../hocs';

import moment from 'moment';

class ProfessionalsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startingTime: '',
      finishingTime: '',
      services: null,
      selectedServices: null,
      validTimeRange: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleHours = this.handleHours.bind(this);
  }

  componentDidMount() {
    this.setState({
      services: this.props.store.services.getAll(),
    })
  }

  handleServices( sender, value, name ) {
    this.setState({
      selectedServices: value,
    });
    this.props.onChange && this.props.onChange('selectedServices', value.id) //tendria que ser un array de ids, no value.id
  }

  handleChange( sender, value, name, valid ) {
    this.props.onChange && this.props.onChange(name, value, valid);
  }

  handleHours(received, valid, name ){
    name = 'hours'
      this.setState({
        startingTime: received[0],
        finishingTime: received[1]
      }) 
    valid = this.state.validTimeRange
    this.props.onChange && this.props.onChange(name, received, valid);
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.startingTime != prevState.startingTime || this.state.finishingTime != prevState.finishingTime) {
      this.setState({validTimeRange: moment(this.state.startingTime,'HH:mm').isBefore(moment(this.state.finishingTime,'HH:mm'))})
    }
  }

  isValidHour() {
    const { startingTime, finishingTime, validTimeRange } = this.state;
    if (startingTime === '' || finishingTime === '') {
      return true;
    }
    return validTimeRange;
  }

  render() {
    if (!this.state.services || !this.state.services.isOk()) {
      return 'Cargando profesionales..';
    }
    const { professional } = this.props;
    const { services } = this.state; 
    return(
      <React.Fragment>
            <Field className="pl-5 pr-5" label="Nombre">
              <TextInput value={ professional && professional.name } name="name" className="is-fullwidth" onChange={ this.handleChange } />
            </Field>
            <Field className="pl-5 pr-5" label="Apellido">
              <TextInput value={ professional && professional.lastName } name="lastName" className="is-fullwidth" onChange={ this.handleChange } />
            </Field>
            <Field className="pl-5 pr-5" label="Teléfono">
              <TextInput value={ professional && professional.phone } name="phone" className="is-fullwidth" onChange={ this.handleChange } />
            </Field>
            <Field className="pl-5 pr-5" label="Mail">
              <TextInput value={ professional && professional.email } name="email" className="is-fullwidth" onChange={ this.handleChange } />
            </Field>
{/*             <Field className="pl-5 pr-5" label="¿En qué sucursal va a atender?" labelNote="Seleccioná una sucursal">
              <Select className="is-fullwidth" placeholder="Sucursales" borderless icon={ faChevronDown } options={ sucursales().map(sucursal => ({key: sucursal.address, value: sucursal.id})) } />
            </Field>
            <Field className="pl-5 pr-5" label="Horarios de trabajo" labelNote="Seleccioná los horarios semanales">
              <WorkingHoursSelector name="hours" startingDate={ moment('05-17-2018 02:30 PM', 'MM-DD-YYYY hh:mm A') } finishingDate={ moment('05-17-2018 06:00 PM', 'MM-DD-YYYY hh:mm A') } onChange={ this.handleHours } />
              { !this.isValidHour() && <Panel color="error" invert ><Text className="has-text-centered">Los horarios ingresados son incorrectos</Text></Panel> }
            </Field> */}
            <Field className="pl-5 pr-5" label="¿Qué servicios ofrece?" labelNote="Seleccioná los servicios">
              {services.toArray().map(servicio => (
                <Checkbox className="pt-1" isFullWidth onClick={console.log("********")}><Text className="pl-1">{startCase(servicio.name)}</Text></Checkbox>
              ))}
{/*               <Select 
            placeholder="Profesionales" 
            borderless 
            icon={ faChevronDown } 
            onChange={ this.handleProfessional }
            options={ professionals.toArray().map( prof => ({ key: `${ startCase(prof.name) } ${ startCase(prof.lastName) }`, value: prof })) } /> */}



            </Field>
      </React.Fragment> )
  }
}

ProfessionalsForm.PropTypes = {
  onChange: PropTypes.func,
  professional : PropTypes.object,
}

ProfessionalsForm.defaultProps = {
  onChange: null,
  professional : null,
}

export default withStore(ProfessionalsForm);
// export default ProfessionalsForm;