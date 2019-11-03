import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css'
import startCase from 'lodash/startCase';

import { Text } from 'shipnow-mercurio';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

import { withStore } from '../../hocs';

@observer
class AppointmentCell extends Component {
  getText(text) {
    return translate(text, this.props.store.ui.language)
  }
  render() {
    const { appointment } = this.props;
    const client = appointment.client;
    return(
      <div className="appointment_card_appointment" id={ appointment.statusClassName }>
        { client ?
          <Text size="xs">{ `${ startCase(client.name) } ${ startCase(client.surname) } a las ${ appointment.beginningTime }` }</Text> :
          <Text size="xs">{ `${ this.getText('Turno') } ${ this.getText('a las') } ${ appointment.beginningTime }` }</Text>
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

export default withStore(AppointmentCell);