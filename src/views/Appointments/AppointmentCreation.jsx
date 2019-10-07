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

import { ReactComponent as SvgDraw } from '../../assets/undraw_booking_33fn.svg';

import { AppointmentsForm } from '../../components/Appointments';

class AppointmentCreation extends Component {
  constructor(props) {
    super(props);

    
  }

  render() {
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
            <AppointmentsForm />
          </Column>
          <Column isSize={ 7 } className="has-text-right">
            <SvgDraw style={{ height: '500px', width: '500px', marginRight: '100px', marginTop: '-25px'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default AppointmentCreation;