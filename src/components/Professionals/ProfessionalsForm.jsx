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
      selectedDays: [],
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

  handleHours(received, valid, name ) {
    name = 'hours'
      this.setState({
        selectedDays: received[0],
        startingTime: received[1],
        finishingTime: received[2]
      }) 
    let ret = []

    //Así tiene el formato correspondiente a la REQUEST que espera el back
    {received[0].map(day => (
    ret.push({"days": day,
    "beginHour": received[1].substring(0, 2),
    "endHour":received[2].substring(0, 2)})
    ))}
          
    valid = (moment(received[1],'HH:mm').isBefore(moment(received[2],'HH:mm')) && received[0].length !== 0)
    this.props.onChange && this.props.onChange(name, ret, valid);
  }

  componentDidUpdate(prevProps, prevState){
    //Extraer los !== a un metodo aparte
    if (this.state.selectedDays != prevState.selectedDays || this.state.startingTime != prevState.startingTime || this.state.finishingTime != prevState.finishingTime) {
      this.setState({validTimeRange: (moment(this.state.startingTime,'HH:mm').isBefore(moment(this.state.finishingTime,'HH:mm')) && this.state.selectedDays.length !== 0)})
    }
  }

  isValidHour() {
    const { startingTime, finishingTime, validTimeRange } = this.state;
    if (startingTime === '' || finishingTime === '') {
      return true;
    }
/*     if (startingTime && finishingTime === '') {
      return false;
    }
    if (finishingTime && startingTime === '') {
      return false;
    } */
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
    this.props.onChange && this.props.onChange('services', newArray, newArray.length !== 0)
  }

  render() {
    if (!this.state.services || !this.state.services.isOk()) {
      return 'Cargando profesionales...';
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
            {/* <Field className="pl-5 pr-5" label="¿En qué sucursal va a atender?" labelNote="Seleccioná una sucursal">
              <Select className="is-fullwidth" placeholder="Sucursales" borderless icon={ faChevronDown } options={ sucursales().map(sucursal => ({key: sucursal.address, value: sucursal.id})) } />
            </Field> */}
            <Field className="pl-5 pr-5" label="¿En qué días y horarios va a trabajar?" labelNote="Seleccioná los horarios semanales">
              <WorkingHoursSelector name="hours" defaultProfessional={professional} startingDate={ moment('05-17-2018 09:00 AM', 'MM-DD-YYYY hh:mm A') } finishingDate={ moment('05-17-2018 06:00 PM', 'MM-DD-YYYY hh:mm A') } days={['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']} onChange={ this.handleHours } />
              { !this.isValidHour() && <Panel className="mt-1" color="error" invert style={{padding: '2px'}}><Text className="has-text-centered">Los días y/o los horarios ingresados son incorrectos</Text></Panel> }
            </Field>
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