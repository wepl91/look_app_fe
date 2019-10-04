import React, { Component } from 'react';

import {
  Column,
  Columns,
  Level,
  LevelLeft,
  LevelRight
} from 'bloomer';

import {
  Title,
  Field,
  DateTimePicker,
  Select,
  SelectItem
} from 'shipnow-mercurio';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { sucursales, horarios, profesionales, servicios } from '../../lib/Mocks';

import { ReactComponent as SvgDraw } from '../../assets/undraw_booking_33fn.svg';

class AppointmentCreation extends Component {
  constructor(props) {
    super(props);

    
  }

  render() {
    debugger 
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Nuevo turno</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column isSize={ 5 } className="pl-5">
            <br />
            <br />
            <Field className="ml-5" label="¿Que día querés venir?" labelNote="Seleccioná ua fecha">
              <DateTimePicker />
            </Field>
            <Field className="ml-5" label="¿A cual de nuestras sucursales querés venir?" labelNote="Seleccioná una sucursal">
              <Select placeholder="Sucursales" borderless icon={ faChevronDown } options={ sucursales().map(sucursal => ({key: sucursal.address, value: sucursal.id})) } />
            </Field>
            <Field className="ml-5" label="¿Por quién querés ser atendido?" labelNote="Seleccioná un profesional">
              <Select placeholder="Profesionales" borderless icon={ faChevronDown } options={ profesionales().map(profesional => ({key: profesional.name, value: profesional.id})) } />
            </Field>
            <Field className="ml-5" label="¿Cual de nuestros servicios requeris?" labelNote="Seleccioná un servicio">
              <Select placeholder="Servicios" borderless icon={ faChevronDown } options={ servicios().map(servicio => ({key: servicio.name, value: servicio.id})) } />
            </Field>
            <Field className="ml-5" label="¿A que hora querés venir?" labelNote="Seleccioná un horario">
              <Select placeholder="Horarios" borderless icon={ faChevronDown } options={ horarios().map(horario => ({key: horario.hour, value: horario.id})) }/>
            </Field>
          </Column>
          <Column isSize={ 7 } className="has-text-right">
            <SvgDraw style={{ height: '500px', width: '500px', marginRight: '100px', marginTop: '-25px'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default AppointmentCreation;