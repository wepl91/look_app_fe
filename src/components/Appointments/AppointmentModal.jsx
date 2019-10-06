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
  faTimes, 
  faCalendarAlt, 
  faTrash, 
  faChevronDown,
  faBan,
  faCircle,
  faInfoCircle,
  faMoneyBill,
  faUserSlash,
  faDotCircle
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

  renderDetails() {
    const { appointment } = this.state;
    const client = appointment.client;
    const services = appointment.services;
    
    const paymentTicket = 
      <PDFDownloadLink document={ <PaymentTicket appointment={ appointment } /> } fileName={`ComprobanteDePago.pdf`}>
      {({ loading }) => ( loading ? 
        <Button className="mt-2" kind="link" icon={ faDownload } disabled>Comprobante de pago</Button> : 
        <Button className="mt-2" kind="link" icon={ faDownload }>Comprobante de pago</Button> )}
      </PDFDownloadLink>;
    
    const cancelationTicket = 
        <PDFDownloadLink document={ <AppointmentCancelledTicket appointment={ appointment } /> } fileName={`Cancelacion.pdf`}>
          {({ loading }) => ( loading ? 
            <Button className="mt-2" kind="link" icon={ faDownload } disabled>Comprobante de cancelación</Button> : 
            <Button className="mt-2" kind="link" icon={ faDownload }>Comprobante de cancelación</Button> )}
        </PDFDownloadLink>;

    const appoinmentTicket = 
        <PDFDownloadLink document={ <AppointmentScheduleTicket appointment={ appointment } /> } fileName={`Reserva.pdf`}>
          {({ loading }) => ( loading ? 
            <Button kind="link" icon={ faDownload } disabled>Comprobante de reserva</Button> : 
            <Button kind="link" icon={ faDownload }>Comprobante de reserva</Button> )}
        </PDFDownloadLink> 

    return(
      <Columns>
        <Column isSize={ 8 }>
          { client &&
            <React.Fragment>
              <Title size="md">Cliente</Title>
              <Text weight="medium">{ appointment.clientFullName }</Text>
            </React.Fragment> }
          { services && 
            <React.Fragment>
              <Title size="md">Servicios</Title>
              { services.map( service => ( 
                <Text weight="medium" className="mb-2">
                  <FontAwesomeIcon icon={ faDotCircle } size="xs" fixedWidth/>
                  { ` ${ startCase(service.name) }` }
                </Text> )) }
            </React.Fragment> }
        </Column>
        <Column isSize={ 4 }>
          <Title size="md">Comprobantes</Title>
          { appoinmentTicket }
          { paymentTicket }
          { cancelationTicket } 
          <Title className="mt-3" size="md">Acciones</Title>
          <div className="appointment-accions">
            <Text><Button kind="link" icon={ faBan       }>Cancelar turno     </Button></Text>
            <Text><Button className="mt-2" kind="link" icon={ faMoneyBill }>Marcar como pagado </Button></Text>
            <Text><Button className="mt-2" kind="link" icon={ faUserSlash }>Marcar como ausente</Button></Text>
          </div>
        </Column>
      </Columns>)
  }

  renderList() {
    const cancellButton = {
      label: 'Acción',
      content: (data) => (<Button kind="link" icon={ faTrash }>Cancelar</Button>)
    }

    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon icon={ faCalendarAlt } readOnly />),
        size: 'is-2',
        align: 'center',
      },
      {
        label: 'Cliente',
        content: (data) => (<Text>{ data.clientFullName != '' ? data.clientFullName : '- sin cliente -' }</Text>),
        size: 'is-4',
        align: 'center',
      },
      {
        label: 'Horario',
        content: (data) => (<Text>{ `${ data.hour } hs` }</Text>),
        size: 'is-4',
        align: 'center',
      },
      {
        label: 'Detalles',
        content: (data) => (<Button kind="link" icon={ faInfoCircle } onClick={ () => ( this.handleShowDetails(data) ) }/>),
        size: 'is-2',
        align: 'center'
      }
    ];

    return(<Table className="ml-5 mr-5" columns={ columns } data={ this.props.appointments } striped={ false }/>)
  }

  render() {
    const { date } = this.props
    return(
      <Modal width="70%" height="80%" show>
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