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
  LevelRight
} from 'bloomer';

import { AppointmentModal } from './'

import startCase from 'lodash/startCase';

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
  

  render() {
    const turnos = [
      {
        name: 'Marta',
        hour: '13:00',
        status: 'approved'
      },
      {
        name: 'Juan',
        hour: '15:00',
        status: 'approved'
      },
      {
        name: 'Ivan',
        hour: '17:00',
        status: 'cancelled'
      }
    ]
    return(
      <React.Fragment>
        <Panel className="appointment_card" key={ this.state.date }>
          <Level>
            <LevelLeft>
              <Text key={ this.state.reload } weight="medium" color="primaryDark">{`${ startCase(this.state.date.format('ddd')) } ${ this.state.date.format('D') }`}</Text>
            </LevelLeft>
            <LevelRight>
              <Text size="sm"className="appointment_card_see_more mr-1" onClick={ this.handleClick }>Ver mas</Text>
            </LevelRight>
          </Level>
          { turnos.map( turno => <div className={ turno.status == 'cancelled' ? 'appointment_card_appointment_cancelled' : 'appointment_card_appointment_approved'}><Text size="xs">{ `${ turno.name } a las ${ turno.hour }` }</Text></div>) }
          </Panel> 
        { this.state.showModal && <AppointmentModal appointments={ turnos } date={ this.state.date } onClose={ this.handleClick } /> }
      </React.Fragment> )
  } 
}

AppointmentCard.PropTypes = {
  date: PropTypes.object,
}

AppointmentCard.defaultProps = {
  date: null
}

export default AppointmentCard;