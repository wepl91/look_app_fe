import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from '../../components/Checkbox'

import {
  Field,
  TextInput,
  Text,
  Panel
} from 'shipnow-mercurio';

import { WorkingHoursSelector } from './';

import startCase from 'lodash/startCase';

import { withStore } from '../../hocs';

import moment from 'moment';

import { observer } from 'mobx-react';

import { nameRegex, mailRegex, phoneRegex } from '../../lib/Regex';

import _ from 'lodash';

@observer
class ProfessionalsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: {},
      services: null,
      selectedServices: [],
      validTimeRange: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleHours = this.handleHours.bind(this);
    this.handleServices = this.handleServices.bind(this);
  }

  componentDidMount() {
    if (this.props.professional && this.state.selectedServices.length == 0) {
      this.setState({
        selectedServices: this.props.professional.professionalServicesIds
      })
    }
    this.setState({
      services: this.props.store.services.search({}, 'services-professional-creation-view', true),
    })
  }

  handleChange(sender, value, name, valid) {
    this.props.onChange && this.props.onChange(name, value, valid);
  }

  handleHours(received, valid, name ) {
    name = 'hours'
    this.setState({
      days: received,
    }) 
    let ret = []
    valid = true
    if(Object.keys(received).length > 0){
      for (const [day, hours] of Object.entries(received)) {
        if(hours['sta'] && hours['fin']){ 
          ret.push({
            "days": day,
            "beginHour": hours['sta'].substring(0, 2),
            "endHour": hours['fin'].substring(0, 2)
          })
          if(!(moment(hours['sta'],'HH:mm').isBefore(moment(hours['fin'],'HH:mm')))){
            valid = false
          }
        }else{
          valid = false
        }
      }
    }else{
      valid = false
    }

    this.setState({validTimeRange: valid})
    this.props.onChange && this.props.onChange(name, ret, valid);
  }

  isValidHour() {
    if(Object.keys(this.state.days).length > 0){
      return this.state.validTimeRange
    }
    return true
  }

  handleServices(value, checked) {
    let newArray = Array.from(this.state.selectedServices)
    if (!checked) {
      newArray = newArray.filter(item => item !== value.id)
    } else {
      newArray.push(value.id)
    }
    this.setState({
      selectedServices: newArray,
    });
    this.props.onChange && this.props.onChange('services', newArray, newArray.length !== 0)
  }

  renderSkeleton() {
    return (
      <React.Fragment>
        <Field className="pl-5 pr-5" label="Nombre">
          <TextInput name="name" className="is-fullwidth" disabled />
        </Field>
        <Field className="pl-5 pr-5" label="Apellido">
          <TextInput name="lastName" className="is-fullwidth" disabled />
        </Field>
        <Field className="pl-5 pr-5" label="Teléfono">
          <TextInput name="phone" className="is-fullwidth" disabled />
        </Field>
        <Field className="pl-5 pr-5" label="Mail">
          <TextInput name="email" className="is-fullwidth" disabled />
        </Field>
        <Field className="pl-5 pr-5" label="¿Qué servicios ofrece?" labelNote="Seleccioná los servicios">
          <Checkbox className="pt-1" checked={ false } >...</Checkbox>
          <Checkbox className="pt-1" checked={ false } >...</Checkbox>
          <Checkbox className="pt-1" checked={ false } >...</Checkbox>
        </Field>
      </React.Fragment>)
  }

  render() {
    if (!this.state.services || !this.state.services.isOk()) {
      return this.renderSkeleton()
    }
    const { professional } = this.props;
    const { services } = this.state;
    return (
      <React.Fragment>
            <Field className="pl-4 pr-4" label="Nombre">
              <TextInput value={ professional && professional.name } name="name" validate={ (value) => (nameRegex.test(value)) } className="is-fullwidth" onChange={ this.handleChange } />
            </Field>
            <Field className="pl-4 pr-4" label="Apellido">
              <TextInput value={ professional && professional.lastName } name="lastName" validate={ (value) => (nameRegex.test(value)) } className="is-fullwidth" onChange={ this.handleChange } />
            </Field>
            <Field className="pl-4 pr-4" label="Teléfono">
              <TextInput value={ professional && professional.phone } name="phone" validate={ (value) => (phoneRegex.test(value)) } className="is-fullwidth" onChange={ this.handleChange } />
            </Field>
            <Field className="pl-4 pr-4" label="Mail">
              <TextInput value={ professional && professional.email } name="email" validate={ (value) => (mailRegex.test(value)) } className="is-fullwidth" onChange={ this.handleChange } />
            </Field>
            {/* <Field className="pl-5 pr-5" label="¿En qué sucursal va a atender?" labelNote="Seleccioná una sucursal">
              <Select className="is-fullwidth" placeholder="Sucursales" borderless icon={ faChevronDown } options={ sucursales().map(sucursal => ({key: sucursal.address, value: sucursal.id})) } />
            </Field> */}
            <Field className="pl-4 pr-4" label="¿En qué días y horarios va a trabajar?" labelNote="Seleccioná los horarios semanales">
              <WorkingHoursSelector name="hours" defaultProfessional={professional} startingDate={ moment('05-17-2018 09:00 AM', 'MM-DD-YYYY hh:mm A') } finishingDate={ moment('05-17-2018 06:00 PM', 'MM-DD-YYYY hh:mm A') } days={['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']} onChange={ this.handleHours } />
              { !this.isValidHour() && <Panel className="mt-1" color="error" invert style={{padding: '2px'}}><Text className="has-text-centered">Los horarios y/o días ingresados son incorrectos</Text></Panel> }
            </Field>
            <Field className="pl-4 pr-4" label="¿Qué servicios ofrece?" labelNote="Seleccioná los servicios">
              {services.toArray().map(serv => (
                <Checkbox className="pt-1" checked={ professional && professional.professionalServicesIds.includes(serv.id)} value={ serv } onCheck={ this.handleServices }>{startCase(serv.name)}</Checkbox>
              ))}
            </Field>
      </React.Fragment> )
  }
}

ProfessionalsForm.PropTypes = {
  onChange: PropTypes.func,
  professional: PropTypes.object,
}

ProfessionalsForm.defaultProps = {
  onChange: null,
  professional: null,
}

export default withStore(ProfessionalsForm);