import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Document, Page, View, Text } from '@react-pdf/renderer'
import styles from './styles.js'

class AppointmentCancelledTicket extends Component {
  render() {
    return(
      <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Cancelación de turno</Text>
          <Text style={styles.description}>Cancelación de turno de Juan Gómez correspondiente al día Viernes 05 de Octubre</Text>
          <Text style={styles.brand}>Hair&Head</Text>
        </View>
        </Page>
      </Document> )
  }
}
AppointmentCancelledTicket.PropTypes = {

}

AppointmentCancelledTicket.defaultProps = {

}
export default AppointmentCancelledTicket