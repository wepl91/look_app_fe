import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import startCase from 'lodash/startCase';

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Title,
  Text,
  Button,
  Table,
  Select,
  Field,
  SelectableIcon
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight,
  Columns,
  Column
} from 'bloomer';

import { 
  faDownload, 
  faEnvelopeOpenText, 
  faTimes, 
  faCalendarAlt, 
  faTrash, 
  faChevronDown, 
  faDotCircle,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";

import { 
  AppointmentScheduleTicket, 
  AppointmentCancelledTicket, 
  PaymentTicket 
} from '../PDFDocuments';

import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { ReactComponent as SvgDraw } from '../../assets/undraw_jewelry_iima.svg';

import { PDFDownloadLink } from '@react-pdf/renderer'


class AppointmentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderCreate : false,
      renderList   : true,
      renderDetails: false
    }
    
    this.handleShowDetails = this.handleShowDetails.bind(this);
    this.handleDetails     = this.handleDetails.bind(this);
    this.handleCreate      = this.handleCreate.bind(this);
    this.handleClose       = this.handleClose.bind(this);
    this.handleList        = this.handleList.bind(this);
  }

  handleShowDetails( appointment ) {
    this.setState({
      renderCreate : false,
      renderList   : false,
      renderDetails: true,
      appointment: appointment,
    })
  }

  handleCreate() {
    this.setState({
      renderCreate : true,
      renderList   : false,
      renderDetails: false,
    })
  }

  handleDetails() {
    this.setState({
      renderDetails: true,
      renderList   : false,
      renderCreate : false,
    })
  }

  handleList() {
    this.setState({
      renderList    : true,
      renderCreate  : false,
      renderDertails: false,
    })    
  }

  handleClose() {
    this.props.onClose && this.props.onClose()
  }

  renderDetails() {
    return("Detalles")
  }

  renderCreate() {
    return(
      <Columns>
        <Column isSize={ 6 }>
          <Field label="¿A cual de nuestras sucursales querés venir?" labelNote="Seleccioná una sucursal">
            <Select placeholder="Sucursales" borderless icon={ faChevronDown } />
          </Field>
          <Field label="¿Por quién querés ser atendido?" labelNote="Seleccioná un profesional">
            <Select placeholder="Profesionales" borderless icon={ faChevronDown } />
          </Field>
          <Field label="¿A que hora querés venir?" labelNote="Seleccioná un horario">
            <Select placeholder="Horarios" borderless icon={ faChevronDown } />
          </Field>
        </Column>
        <Column className="has-text-centered">
          <SvgDraw style={{ height: '300px', width: '300px' }}/>
        </Column>
      </Columns> )
  }

  renderList() {
    const paymentTicket = {
      align: 'center',
      label: 'Comprobante pago',
      content: (data) => (
      <PDFDownloadLink document={ <PaymentTicket /> } fileName={`ComprobanteDePago.pdf`}>
      {({ blob, url, loading, error }) => ( loading ? 
        <Button kind="link" icon={ faDownload } disabled /> : 
        <Button kind="link" icon={ faDownload } /> )}
      </PDFDownloadLink> ),
    }
    const cancelationTicket = { 
      align: 'center',
      label: 'Comprobante cancelación',
      content: (data) => (
        <PDFDownloadLink document={ <AppointmentCancelledTicket /> } fileName={`Cancelacion.pdf`}>
          {({ blob, url, loading, error }) => ( loading ? 
            <Button kind="link" icon={ faDownload } disabled /> : 
            <Button kind="link" icon={ faDownload } /> )}
        </PDFDownloadLink> )
    }
    const appoinmentTicket = { 
      size: 'is-2',
      align: 'center',
      label: 'Comprobante reserva',
      content: (data) => (
        <PDFDownloadLink document={ <AppointmentScheduleTicket /> } fileName={`Reserva.pdf`}>
          {({ blob, url, loading, error }) => ( loading ? 
            <Button kind="link" icon={ faDownload } disabled /> : 
            <Button kind="link" icon={ faDownload } /> )}
        </PDFDownloadLink> )
    }

    const cancellButton = {
      label: 'Acción',
      content: (data) => (<Button kind="link" icon={ faTrash }>Cancelar</Button>)
    }

    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon icon={ faCalendarAlt } readOnly />),
        size: 'is-1',
      },
      {
        label: 'Cliente',
        content: (data) => (<Text>{ data.clientFullName }</Text>),
        size: 'is-2',
      },
      {
        label: 'Horario',
        content: (data) => (<Text>{ `${ data.hour } hs` }</Text>),
        size: 'is-2'
      },
      {
        label: 'Servicios',
        content: (data) => (
          <Columns>
            <Column>
              { data.services.map( service => ( <Text>{ `- ${ startCase(service.name) }` }</Text> )) }
            </Column>
          </Columns> ),
        size: 'is-2'
      },
      appoinmentTicket,
      {
        label: 'Detalles',
        content: (data) => (<Button kind="link" icon={ faInfoCircle } onClick={ () => ( this.handleShowDetails(data) ) }/>),
        size: 'is-1',
        align: 'center'
      }
    ];

    return(<Table columns={ columns } data={ this.props.appointments } striped={ false }/>)
  }

  render() {
    const { date } = this.props
    return(
      <Modal width="70%" height="70%" show>
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>{ this.state.renderCreate ? 'Nuevo turno' : `${ moment(date).format('LL') }` }</Title>
            </LevelLeft>
            <LevelRight>
            <Button icon="plus" kind="link" size="xl" onClick={ this.handleClose }>
              <FontAwesomeIcon icon={ faTimes }/>
            </Button>
            </LevelRight>
            </Level>
        </ModalHeader>
        <ModalContent>
          { this.state.renderCreate && this.renderCreate() }
          { this.state.renderList && this.renderList() }
          { this.state.renderDetails && this.renderDetails() }
          </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft>{ this.state.renderCreate && <Button kind="outline">Reservar turno</Button> }</LevelLeft>
            <LevelLeft>
              { this.state.renderCreate && 
                <Button kind="link" onClick={ this.handleList }>
                  <FontAwesomeIcon className="mr-2" icon={ faCalendarAlt }/>Ver los turnos de hoy</Button> }
              { this.state.renderList && 
                <Button kind="link" onClick={ this.handleCreate }>
                  <FontAwesomeIcon className="mr-2" icon={ faCalendarAlt }/>Crear un turno para hoy</Button> }
            </LevelLeft>
          </Level>
        </ModalFooter>
      </Modal> )
  }
}
AppointmentModal.PropTypes = {
  date: PropTypes.object,
  onClose: PropTypes.func,
  appointments: PropTypes.array
}

AppointmentModal.defaultProps = {
  date: null,
  onClose: null,
  appointments: []
}

export default AppointmentModal;