import React, { Component } from 'react';

import moment from 'moment';

import {
  Column,
  Columns,
  Level,
  LevelLeft,
  LevelRight,
  Checkbox
} from 'bloomer';

import {
  Button,
  Select,
  Field,
  TextInput,
  Title,
  Text,
  DateTimePicker,
  Time
} from 'shipnow-mercurio';

import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";

import { sucursales, servicios } from '../../lib/Mocks';

import { ReactComponent as SvgDraw } from '../../assets/undraw_online_cv_qy9w.svg';

class ProfessionalCreation extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   price: '',
    //   buttonDisabled: false,
    // }

    // this.handleChange = this.handleChange.bind(this);
  }

  // handleChange( sender, value, name, valid ) {
  //   if (name == 'price') {
  //     this.setState({
  //       price: value,
  //       buttonDisabled: valid.type == 'error',
  //     })
  //   }
  // }

  render() {
    // const priceRegex = /[a-zA-Z]/
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Nuevo profesional</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column className="pl-5 pr-5">
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
              <Select placeholder="Sucursales" borderless icon={ faChevronDown } options={ sucursales().map(sucursal => ({key: sucursal.address, value: sucursal.id})) } />
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
            <Button className="ml-5" kind="outline">Agregar profesional</Button>
          </Column>
          <Column>
          <SvgDraw style={{ height: '75%', width: '75%' }}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default ProfessionalCreation;