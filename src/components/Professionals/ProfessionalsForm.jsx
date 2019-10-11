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

import { observer } from 'mobx-react';

@observer
class ProfessionalsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startingTime: '',
      finishingTime: '',
      services: null,
      selectedServices: [],
      validTimeRange: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleHours = this.handleHours.bind(this);
    this.handleServices = this.handleServices.bind(this);
  }

  componentDidMount() {
    if (this.props.professional && this.state.selectedServices.length == 0){
      this.setState({
        selectedServices: this.props.professional.professionalServicesIds
      })
    }
    this.setState({
      services: this.props.store.services.getAll(),
    })
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

  handleServices( value ) {
    let newArray = Array.from(this.state.selectedServices)
    if(newArray.includes(value)){
      newArray = newArray.filter(item => item !== value)
    }else{
      newArray.push(value)
    }
    this.setState({
      selectedServices: newArray,
    });
    this.props.onChange && this.props.onChange('services', newArray)
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
              {services.toArray().map(serv => (
                <Checkbox className="pt-1" isFullWidth onClick={() => this.handleServices(serv.id)} defaultChecked={ professional && professional.professionalServicesIds.includes(serv.id)} ><Text className="pl-1">{startCase(serv.name)}</Text></Checkbox>
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

export default withStore(ProfessionalsForm);