import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Document, Page, View, Text } from '@react-pdf/renderer'
import styles from './styles.js';
import moment from 'moment';
import startCase from 'lodash/startCase';

class AppointmentScheduleTicket extends Component {
  render() {
    const { appointment } = this.props
    const client = appointment.client;
    const branch = appointment.branch;
    const professional = appointment.professional;
    const services = appointment.services;
    return(
      <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Reserva de turno</Text>
          <Text style={styles.description}>{`Reserva de turno${ client ? ` de ${ startCase(client.name) } ${ client.lastName} , ${ client.cookedPhone ? `teléfono: ${ client.cookedPhone }` : '' },`: '' } para el día ${ moment(appointment.dayHour).format("DD-MM-YYYY") } a las ${ appointment.beginningTime }${ branch && `, en la sucursal ${ branch.name || branch.cookedAddress }` }.`}</Text>
          <View style={styles.details}>
            { professional && <Text style={styles.service}>{ `A ser atendido por ${ appointment.professionalFullName }` }</Text> }
            <Text style={ styles.subtitle }>Servicios:</Text>
            { services.map( service => (<View><Text style={styles.service}>{ `- ${ startCase(service.name) }: $${ service.price }` }</Text></View>)) }
            <Text style={ styles.subtitle }>{ `Total: $${ appointment.totalPrice } `}</Text>
          </View>
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
