import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css'
import startCase from 'lodash/startCase';

import { Text } from 'shipnow-mercurio';
class AppointmentCell extends Component {
  render() {
    const { appointment } = this.props;
    const client = appointment.client;
    return(
      <div className="appointment_card_appointment" id={ appointment.statusClassName }>
        { client ?
          <Text size="xs">{ `${ startCase(client.name) } ${ startCase(client.surname) } a las ${ appointment.hour }` }</Text> :
          <Text size="xs">{ `Turno a las ${ appointment.hour }` }</Text>
        }
        
      </div> )
  }
}

AppointmentCell.PropTypes = {
  appointment: PropTypes.object,
}

AppointmentCell.defaultProps = {
  appointment: null,
}

export default AppointmentCell;