import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Document, Page, View, Text } from '@react-pdf/renderer'
import styles from './styles.js'
import moment from 'moment';
import startCase from 'lodash/startCase';

class PaymentTicket extends Component {
  getTotalAmount( appointment ) {
    let result = 0;
    appointment.services.map( service => (result += parseInt(service.price)));

    return result
  }
  render() {
    const { appointment } = this.props;
    return(
      <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Comprobante de pago</Text>
          <Text style={styles.description}>{ `El cliente ${ appointment.client ? startCase(appointment.client.name) : ''} ${ appointment.client ? startCase(appointment.client.lastName) : ''} abonó en efectivo ${ `$${ this.getTotalAmount(appointment) }` } por el turno correspondiente al día ${ moment(appointment.dayHour).format("dddd, MMMM Do YYYY") }`}</Text>
          <Text style={styles.brand}>Hair&Head</Text>
        </View>
        </Page>
      </Document> )
  }
}
PaymentTicket.PropTypes = {
  appointment: PropTypes.object,
}

PaymentTicket.defaultProps = {
  appointment: null,
}
export default PaymentTicket