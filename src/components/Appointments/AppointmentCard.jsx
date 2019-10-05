import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css'

import {
  Panel,
  Text,
  Button,
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight,
} from 'bloomer';

import { AppointmentModal } from './'

import startCase from 'lodash/startCase';

import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

import moment from 'moment';

class AppointmentCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.props.date,
      reload: false,
      showModal: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.date != this.props.date) {
      this.setState(prevState => ({
        reload: !prevState
      }))
    }
  }

  handleClick() {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }))
  }

  isToday( date ) {
    return moment(date).isSame(moment(), 'day') && moment(date).isSame(moment(), 'month') && moment(date).isSame(moment(), 'year')
  } 

  isSunday( date ) {
    return moment(date).weekday() == 1;
  }

  getTurnos() {
    return this.props.appointments.filter( appointment => ( 
      appointment.dayHour.isSame(this.state.date, 'day') && 
      appointment.dayHour.isSame(this.state.date, 'month') && 
      appointment.dayHour.isSame(this.state.date, 'year')))
  }
  
  render() {
    const turnos = this.getTurnos();
    debugger
    return(
      <div className="appointment_card">
        <Panel invert={ this.isToday(this.state.date) } className="appointment_card_panel" key={ this.state.date }>
          <Level>
            <LevelLeft>
              <Text className="ml-1" size="md" key={ this.state.reload } weight="medium" color="primaryDark">{`${ startCase(this.state.date.format('ddd')) } ${ this.state.date.format('D') }`}</Text>
            </LevelLeft>
            <LevelRight>
              <Button disabled={ turnos.length == 0 } icon={ faEllipsisH } kind="link" onClick={ this.handleClick }/>
            </LevelRight>
          </Level>
          { turnos.map( (turno, index) => index < 4 && <div className={ turno.status == 'cancelled' ? 'appointment_card_appointment_cancelled' : 'appointment_card_appointment_approved'}><Text size="xs">{ `${ turno.name } a las ${ turno.hour }` }</Text></div>) }
          </Panel> 
        { this.state.showModal && <AppointmentModal appointments={ turnos } date={ this.state.date } onClose={ this.handleClick } /> }
      </div> )
  } 
}

AppointmentCard.PropTypes = {
  date: PropTypes.object,
  appointments: PropTypes.array,
}

AppointmentCard.defaultProps = {
  date: null,
  appointments: null,
}

export default AppointmentCard;