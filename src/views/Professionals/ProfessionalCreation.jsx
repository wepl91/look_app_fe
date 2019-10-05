import React, { Component } from 'react';

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

import { WorkingHoursSelector } from '../../components/Professionals';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { sucursales, servicios, horariosFormateados } from '../../lib/Mocks';

import { ReactComponent as SvgDraw } from '../../assets/undraw_online_cv_qy9w.svg';
import moment from 'moment';

class ProfessionalCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startingTime: '',
      finishingTime: '',
      validTimeRange: true
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(receivedTime){
    this.setState({ startingTime:  receivedTime[0] });
    this.setState({ finishingTime:  receivedTime[1] });
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
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Nuevo profesional</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column className="pl-5 pr-5" isSize={6}>
            <Field className="pl-5 pr-5" label="Nombre">
              <TextInput className="is-fullwidth" />
            </Field>
            <Field className="pl-5 pr-5" label="Apellido">
              <TextInput className="is-fullwidth" />
            </Field>
            <Field className="pl-5 pr-5" label="Teléfono">
              <TextInput className="is-fullwidth" />
            </Field>
            <Field className="pl-5 pr-5" label="Mail">
              <TextInput className="is-fullwidth" />
            </Field>
            <Field className="pl-5 pr-5" label="¿En qué sucursal va a atender?" labelNote="Seleccioná una sucursal">
              <Select className="is-fullwidth" placeholder="Sucursales" borderless icon={ faChevronDown } options={ sucursales().map(sucursal => ({key: sucursal.address, value: sucursal.id})) } />
            </Field>
            <Field className="pl-5 pr-5" label="Horarios de trabajo" labelNote="Seleccioná los horarios semanales">
              <WorkingHoursSelector onChange={ this.handleChange } name="hours" startingDate={ moment('05-17-2018 02:30 PM', 'MM-DD-YYYY hh:mm A') } finishingDate={ moment('05-17-2018 06:00 PM', 'MM-DD-YYYY hh:mm A') }/>
              { !this.isValidHour() && <Panel color="error" invert ><Text className="has-text-centered">Los horarios ingresados son incorrectos</Text></Panel> }
            </Field>
            <Field className="pl-5 pr-5" label="¿Qué servicios ofrece?" labelNote="Seleccioná los servicios">
              {servicios().map((servicio, index) => (
                <Checkbox className="pt-1" isFullWidth><Text className="pl-1">{servicio.name}</Text></Checkbox>
              ))}
            </Field>
            <br/>
            <br/>
            <br/>
            <br/>
            <Button className="ml-5" kind="outline" disabled={!this.state.validTimeRange}>Agregar profesional</Button>
          </Column>
          <Column isSize={6}>
            <SvgDraw style={{ height: '100%', width: '100%'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default ProfessionalCreation;