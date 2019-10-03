import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer'

class AppointmentScheduleTicket extends Component {
  render() {
    const styles = StyleSheet.create({
      page: { 

       },
      section: { 
        padding: '16pt',
        textAlign: 'center', 
        margin: 30,
        height: '10cm',
        width: '15cm',
        borderTopStyle: 'solid',
        borderTopWidth: '2pt',
        borderTopColor: '#830d0d',
        borderBottomStyle: 'solid',
        borderBottomWidth: '2pt',
        borderBottomColor: '#830d0d',
        borderLeftStyle: 'solid',
        borderLeftWidth: '2pt',
        borderLeftColor: '#830d0d',
        borderRightStyle: 'solid',
        borderRightWidth: '2pt',
        borderRightColor: '#830d0d',
        borderTopLeftRadius: '5pt',
        borderTopRightRadius: '5pt',
        borderBottomLeftRadius: '5pt',
        borderBottomRightRadius: '5pt',
      },
      title: {
        marginTop: '8pt',
        fontSize: 24,
        textAlign: 'center',
      },
      description: {
        marginTop: '32pt',
        fontSize: 18,
        textAlign: 'center',
      },
      brand: {
        marginTop: '4cm',
        fontSize: 20,
        textAlign: 'center',
      }
    });
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
