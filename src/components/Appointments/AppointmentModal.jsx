import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import startCase from 'lodash/startCase';

import { withToastManager } from 'react-toast-notifications';

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Title,
  Text,
  Button,
  Table,
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

import { AppointmentsForm } from './';

import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { PDFDownloadLink } from '@react-pdf/renderer'

import { ReactComponent as SvgDraw } from '../../assets/undraw_jewelry_iima.svg';
import { ReactComponent as SvgDraw2 } from '../../assets/undraw_no_data_qbuo.svg';

import { Appointment } from '../../models';

import { withStore } from '../../hocs';

import { AppontmentForm } from './'

import './styles.css';

class AppointmentModal extends Component {
  
  newAppointment
  
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      renderCreate : false,
      renderList   : true,
      renderDetails: false
    }
    
    this.handleShowDetails = this.handleShowDetails.bind(this);
    this.handleDetails     = this.handleDetails.bind(this);
    this.handleChange      = this.handleChange.bind(this);
    this.handleCreate      = this.handleCreate.bind(this);
    this.handleClose       = this.handleClose.bind(this);
    this.handleList        = this.handleList.bind(this);
    this.handleSave        = this.handleSave.bind(this);

    this.handlePay         = this.handlePay.bind(this);
    this.handleCancel      = this.handleCancel.bind(this);
    this.handleMiss        = this.handleMiss.bind(this);
  }

  handlePay() {
    this.state.appointment.pay().then(() =>{
      this.props.onClose && this.props.onClose(true)
    });
  }

  handleCancel() {
    this.state.appointment.cancel().then(() =>{
      this.props.onClose && this.props.onClose(true)
    });
  }

  handleMiss() {
    this.state.appointment.miss().then(() =>{
      this.props.onClose && this.props.onClose(true)
    });
  }

  handleSave() {
    const { toastManager } = this.props;
    this.setState({
      isSaving: true
    }, () => {
      this.newAppointment.save().andThen( (savedAppointment, responseError) => {
        if (responseError) {
          toastManager.add("Ups! Parece que hubo un error al guardar los cambios!", {
            appearance: 'error',
            autoDismiss: true,
            pauseOnHover: false,
          });
        }
        else {
          toastManager.add("El turno se reservó existosamente!", {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
          this.props.onClose && this.props.onClose(true)
        }
      })
    })
  }

  handleChange( name, value ) {
    if (name == 'hour') {
      this.newAppointment.dayHour.hour(value);
      this.newAppointment.dayHour.minute(0);
      this.newAppointment.dayHour.second(0);
    }
    else if (name == 'services') {
      this.newAppointment.services.push(value);
    }
    else {
      this.newAppointment[name] = value
    }
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
    this.newAppointment = new Appointment({}, this.props.store.appointments);
    this.newAppointment.dayHour = this.props.date ? moment(this.props.date) : moment();
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
      renderList   : true,
      renderCreate : false,
      renderDetails: false,
    })    
  }

  handleClose() {
    this.props.onClose && this.props.onClose()
  }

  renderCreate() {
    return(
      <Columns>
        <Column isSize={ 6 }>
          <AppointmentsForm onChange={ this.handleChange } withDate/>
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
    const professional = appointment.professional;
    
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
          <AppointmentsForm appointment={ this.state.appointment } />
        </Column>
        <Column isSize={ 4 }>
          <Title size="md">Comprobantes</Title>
          { appoinmentTicket }
          { paymentTicket }
          { cancelationTicket } 
          <Title className="mt-3" size="md">Acciones</Title>
          <div className="appointment-accions">
            { appointment.isOpen && <Text><Button kind="link" icon={ faBan } onClick={ this.handleCancel }>Cancelar turno</Button></Text> }
            { appointment.isOpen && <Text><Button className="mt-2" kind="link" icon={ faMoneyBill } onClick={ this.handlePay }>Marcar como pagado </Button></Text> }
            {/*<Text><Button className="mt-2" kind="link" icon={ faUserSlash } onClick={ this.handleMiss }>Marcar como ausente</Button></Text>*/}
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
    if (this.props.appointments.length < 1) {
      return(
        <Columns className="has-text-centered">
          <Column>
            <Title size="md">No hay turnos para la fecha</Title>
            <SvgDraw2  className="empty_draw" />
          </Column>
        </Columns> )
    }
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
          { this.state.renderCreate  && this.renderCreate() }
          { this.state.renderList    && this.renderList() }
          { this.state.renderDetails && this.renderDetails() }
          </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft>{ this.state.renderCreate && 
              <Button kind="outline" onClick={ this.handleSave }>Reservar turno</Button>}</LevelLeft>
            <LevelLeft>
              { this.state.renderCreate || this.state.renderDetails ?
                <Button kind="link" onClick={ this.handleList }>
                  <FontAwesomeIcon className="mr-2" icon={ faCalendarAlt }/>Ver los turnos de hoy</Button> : null }
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

export default withToastManager(withStore(AppointmentModal));