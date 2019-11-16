import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Document, Page, View, Text } from '@react-pdf/renderer'
import styles from './styles.js'
import moment from 'moment';
import startCase from 'lodash/startCase';

class AppointmentCancelledTicket extends Component {
  render() {
    const { appointment } = this.props;
    return(
      <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Cancelación de turno</Text>
          <Text style={styles.description}>
            { `Cancelación de turno${ appointment.client ? ` de ${ startCase(appointment.client.name) } ${ appointment.client.lastName }` : ''} correspondiente al día ${ moment(appointment.dayHour).format("DD-MM-YYYY") }` }
          </Text>
          <Text style={styles.brand}>Hair&Head</Text>
        </View>
        </Page>
      </Document> )
  }
}
AppointmentCancelledTicket.PropTypes = {
  appointment: PropTypes.object,
}

AppointmentCancelledTicket.defaultProps = {
  appointment: null,
}
export default AppointmentCancelledTicket