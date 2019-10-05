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

import moment from 'moment';

class ProfessionalsForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleHours = this.handleHours.bind(this);
  }

  handleChange( sender, value, name, valid ) {
    this.props.onChange && this.props.onChange(name, value, valid);
  }

  handleHours(received, valid, name ){
    name = 'hours'
    this.props.onChange && this.props.onChange(name, received, valid);
  }

  render() {
    const { professional } = this.props
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
            <Field className="pl-5 pr-5" label="¿En qué sucursal va a atender?" labelNote="Seleccioná una sucursal">
              <Select className="is-fullwidth" placeholder="Sucursales" borderless icon={ faChevronDown } options={ sucursales().map(sucursal => ({key: sucursal.address, value: sucursal.id})) } />
            </Field>
            <Field className="pl-5 pr-5" label="Horarios de trabajo" labelNote="Seleccioná los horarios semanales">
              <WorkingHoursSelector name="hours" startingDate={ moment('05-17-2018 02:30 PM', 'MM-DD-YYYY hh:mm A') } finishingDate={ moment('05-17-2018 06:00 PM', 'MM-DD-YYYY hh:mm A') } onChange={ this.handleHours } />
            </Field>
            <Field className="pl-5 pr-5" label="¿Qué servicios ofrece?" labelNote="Seleccioná los servicios">
              {servicios().map((servicio, index) => (
                <Checkbox className="pt-1" isFullWidth><Text className="pl-1">{servicio.name}</Text></Checkbox>
              ))}
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

export default ProfessionalsForm;