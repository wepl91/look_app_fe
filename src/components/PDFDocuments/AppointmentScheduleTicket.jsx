import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Document, Page, View, Text } from '@react-pdf/renderer'
import styles from './styles.js'

class AppointmentScheduleTicket extends Component {
  render() {
    return(
      <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Reserva de turno</Text>
          <Text style={styles.description}>Reserva de turno de Juan, teléfono 1131387476, para el día Viernes 05 de Octubre</Text>
          <Text style={styles.brand}>Hair&Head</Text>
        </View>
        </Page>
      </Document> )
  }
}
AppointmentScheduleTicket.PropTypes = {

}

AppointmentScheduleTicket.defaultProps = {

}
export default AppointmentScheduleTicket
