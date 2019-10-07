import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Document, Page, View, Text } from '@react-pdf/renderer'
import styles from './styles.js';
import moment from 'moment';
import startCase from 'lodash/startCase';

class AppointmentScheduleTicket extends Component {
  render() {
    const { appointment } = this.props
    return(
      <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Reserva de turno</Text>
          <Text style={styles.description}>{`Reserva de turno${ appointment.client ? ` de ${ startCase(appointment.client.name) } ${ appointment.client.lastName} , teléfono ${ appointment.client.phone },`: '' } para el día ${ moment(appointment.dayHour).format("dddd, MMMM Do YYYY") }`}</Text>
          <Text style={styles.brand}>Hair&Head</Text>
        </View>
        </Page>
      </Document> )
  }
}
AppointmentScheduleTicket.PropTypes = {
  appointment: PropTypes.object,
}

AppointmentScheduleTicket.defaultProps = {
  appointment: null,
}
export default AppointmentScheduleTicket
