import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer'
import styles from './styles.js'

class PaymentTicket extends Component {
  render() {
    return(
      <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Comprobante de pago</Text>
          <Text style={styles.description}>El cliente Juan Gómez abonó en efectivo $150 por el turno correspondiente al día Viernes 05 de Octubre</Text>
          <Text style={styles.brand}>Hair&Head</Text>
        </View>
        </Page>
      </Document> )
  }
}
PaymentTicket.PropTypes = {

}

PaymentTicket.defaultProps = {

}
export default PaymentTicket