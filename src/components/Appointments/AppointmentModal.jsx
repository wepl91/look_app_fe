import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

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
  SelectableIcon,
  Panel
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
  faSpinner,
  faBan,
  faInfoCircle,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";

import { 
  AppointmentScheduleTicket, 
  AppointmentCancelledTicket, 
  PaymentTicket 
} from '../PDFDocuments';

import { AppointmentsForm } from './';

import { PaymentModal } from './../Payments/'

import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { PDFDownloadLink } from '@react-pdf/renderer'

import { ReactComponent as SvgDraw } from '../../assets/undraw_jewelry_iima.svg';
import { ReactComponent as SvgDraw2 } from '../../assets/undraw_no_data_qbuo.svg';

import { Appointment } from '../../models';

import { withStore } from '../../hocs';

import { ConfirmationModal } from '../ConfirmationModal';

import './styles.css';

class AppointmentModal extends Component {
  
  newAppointment
  
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      renderCreate : false,
      renderList   : true,
      renderDetails: false,
      confirmation: false,
      infoAdvice: false,
      showTicketModal: false,
      buttonDisabled: true,
      showPaymentModal: false,
      confirmationData: {
        accept: null,
        cancel: null,
        title: null,
        content: null,
      },
      infoAdviceData: {
        accept: null,
        cancel: null,
        title: null,
        content: null,
      }
    }
    
    this.handleCancelConfirm = this.handleCancelConfirm.bind(this);
    this.handleCancelTicket  = this.handleCancelTicket.bind(this);
    this.handleShowDetails   = this.handleShowDetails.bind(this);
    this.handleSaveEdit      = this.handleSaveEdit.bind(this);
    this.handleDetails       = this.handleDetails.bind(this);
    this.handleChange        = this.handleChange.bind(this);
    this.handleCreate        = this.handleCreate.bind(this);
    this.handleClose         = this.handleClose.bind(this);
    this.handleList          = this.handleList.bind(this);
    this.handleSave          = this.handleSave.bind(this);
    this.handlePay           = this.handlePay.bind(this);

    this.handleCancel        = this.handleCancel.bind(this);
    this.handleMiss          = this.handleMiss.bind(this);
    this.handleCancelAdvice  = this.handleCancelAdvice.bind(this);
  }

  handlePay( name, response ) {
    if(name == "paid"){
      this.setState({
        appointment: new Appointment(response.results, this.props.store.appointments),
        showTicketModal: true,
        showTicketAction: 'pay',
        renderDetails: true,
        confirmation: false,
      });
    }
    this.setState(prevState => ({
      showPaymentModal: !prevState.showPaymentModal
    }))
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

  isProfessionalBusyMsj( responseError ) {
    const errorMsj = responseError.message;
    return errorMsj && JSON.parse(errorMsj).message && JSON.parse(errorMsj).message == 'professional is busy';
  }

  allProfessionalsBusyMsj( responseError ) {
    const errorMsj = responseError.message
    return errorMsj && JSON.parse(errorMsj).message && JSON.parse(errorMsj).message == 'there are no free professionals';
  }

  save( appointment, edit=false ) {
    const { toastManager } = this.props;
    appointment = appointment.clean();
    this.setState({
      isSaving: true
    }, () => {
      appointment.save().andThen( (savedAppointment, responseError) => {
        if (responseError) {
          if (this.isProfessionalBusyMsj(responseError)) {
            toastManager.add("Ups! Parece que hubo problema! El profesional seleccionado se encuentra ocupado en el horario en el que se quiere crear el turno!", {
              appearance: 'error',
              autoDismiss: true,
              pauseOnHover: false,
            });
            this.setState({
              isSaving: false,
            });
          }else
          if (this.allProfessionalsBusyMsj(responseError)) {
            toastManager.add("Ups! Parece que hubo problema! No hay profesionales que puedan atender en ese horario!", {
              appearance: 'error',
              autoDismiss: true,
              pauseOnHover: false,
            });
            this.setState({
              isSaving: false,
            });
          }
          else {
            toastManager.add("Ups! Parece que hubo un error al guardar los cambios!", {
              appearance: 'error',
              autoDismiss: true,
              pauseOnHover: false,
            });
            this.setState({
              isSaving: false,
            });
          }     
        }
        else {
          toastManager.add("El turno se reservó existosamente!", {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
          if (edit) {
            this.setState({
              showTicketModal: true,
              isSaving: false,
              appointment: savedAppointment
            });
          }
        }
      })
    })
  }

  handleCancelTicket() {
    this.setState({
      showTicketModal: false,
    }, () => ( this.props.onClose && this.props.onClose(true) ))
  }

  handleSaveEdit() {
    const { appointment } = this.state;
    this.save(appointment, true)
  }

  handleSave() {
    const { toastManager } = this.props;
    this.save(this.newAppointment);
  }

  handleChange( name, value ) {
    this.setState({
      buttonDisabled: false
    })
    const appointment = this.state.renderDetails ? this.state.appointment : this.newAppointment;
    if (name == 'hour') {
      appointment.dayHour.hour(value);
      appointment.dayHour.minute(0);
      appointment.dayHour.second(0);
    }
    else {
      appointment[name] = value
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
      infoAdvice: false,
    })    
  }

  handleInformationAdvice( action ) {
    let data = {} 
    if (action == 'list') {
      data['accept']  = this.handleList;
      data['cancel']  = this.handleCancelAdvice;
      data['content'] = 'Al cambiar a la pantalla de visualización de turnos, vas a perder los datos que hayas cargado.';
    }
    this.setState({
      infoAdvice: true,
      infoAdviceData: data,
    })
  }

  handleClose() {
    this.props.onClose && this.props.onClose()
  }

  handleCancelAdvice() {
    this.setState({
      infoAdvice: false
    })
  }

  handleCancelConfirm() {
    this.setState({
      confirmation: false,
    })
  }

  handleConfirm( action ) {
    let data = {};
    if (action == 'cancel') {
      data['title']   = 'Cancelación de turno';
      data['accept']  = this.handleCancel;
      data['cancel']  = this.handleCancelConfirm;
      data['content'] = 'El turno será cancelado. Luego de ejecutar esta acción, no podrá revertirse.';
    }
    this.setState({
      confirmation:true,
      confirmationData: data,
    });
  }

  renderPaymentModal() {
    const { appointment } = this.state;
    const { date } = this.props;
    return (<PaymentModal date={ date } appointment={ appointment } onPay={ this.handlePay }/>)
  }

  renderConfirmationModal() {
    const { confirmationData } = this.state;
    return (<ConfirmationModal 
              title=   { confirmationData.title   }
              content= { confirmationData.content } 
              onAccept={ confirmationData.accept  } 
              onCancel={ confirmationData.cancel  } />)
  }

  renderInformationAdvice() {
    const { infoAdviceData } = this.state;
    return(<ConfirmationModal 
              title=   { infoAdviceData.title   }
              content= { infoAdviceData.content } 
              onAccept={ infoAdviceData.accept  } 
              onCancel={ infoAdviceData.cancel  } />)
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

  renderTicketAdvise() {
    return(
      <Panel color="warning" invert style={{padding: '8px'}} className="mt-3">
        <Text multiline>Acabas de editar el turno, recordá que podes descargar un comprobante con la informació actualizada!</Text>
      </Panel> )
  }

  renderDetails() {
    const { appointment, showTicketModal } = this.state;
    
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
        <PDFDownloadLink key={ this.state.showTicketModal }document={ <AppointmentScheduleTicket appointment={ appointment } /> } fileName={`Reserva.pdf`}>
          {({ loading }) => ( loading ? 
            <Button kind="link" icon={ faDownload } disabled>Comprobante de reserva</Button> : 
            <Button kind="link" icon={ faDownload }>Comprobante de reserva</Button> )}
        </PDFDownloadLink> 
    return(
      <Columns>
        <Column isSize={ 6 }>
          <AppointmentsForm appointment={ this.state.appointment } edit onChange={ this.handleChange }/>
        </Column>
        <Column isSize={ 2 }></Column>
        <Column isSize={ 4 }>
        <Title size="md">Comprobantes</Title>
        { appointment.isOpen      && appoinmentTicket }
        { appointment.isPaid      && paymentTicket }
        { appointment.isCancelled && cancelationTicket } 
        { appointment.isOpen && <Title className="mt-3" size="md">Acciones</Title> }
        <div className="appointment-accions">
        { appointment.isOpen && 
          <Text>
          <Button kind="link" icon={ faBan } onClick={ () => (this.handleConfirm('cancel')) }>Cancelar turno</Button>
          </Text> }
          { appointment.isOpen && 
            <Text>
            <Button className="mt-2" kind="link" icon={ faMoneyBill } onClick={ this.handlePay }>Efectuar pago </Button>
            </Text> }
            </div>
          { this.state.showTicketModal && this.renderTicketAdvise() }
        </Column>
      </Columns>)
  }

  renderList() {
    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon icon={ faCalendarAlt } readOnly />),
        size: 'is-1',
      },
      {
        label: 'Cliente',
        content: (data) => (<Text>{ data.clientFullName != '' ? data.clientFullName : '- sin cliente -' }</Text>),
        size: 'is-2',
      },
      {
        label: 'Profesional',
        content: (data) => (<Text>{ data.professionalFullName }</Text>),
        size: 'is-2'
      },
      {
        label: 'Horario',
        content: (data) => (<Text>{ `De ${ data.beginningTime } hs a ${ data.finishTime }` }</Text>),
        size: 'is-2',
      },
      {
        label: 'Precio',
        content: (data) => (<Text>{ `$${ data.totalPrice }` }</Text>),
        size: 'is-2',
        align: 'center',
      },
      {
        label: 'Estado',
        content: (data) => (<Text>{ data.cookedStatus }</Text>),
        size: 'is-2',
        align: 'center',
      },
      {
        label: 'Detalles',
        content: (data) => (<Button kind="link" icon={ faInfoCircle } onClick={ () => ( this.handleShowDetails(data) ) }/>),
        size: 'is-1',
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
    
    return(<Table columns={ columns } data={ this.props.appointments } striped={ false }/>)
  }

  getDisabled() {
    return this.state.appointment && !(this.state.appointment.services.length > 0 && !this.state.buttonDisabled)
  }

  render() {
    const { date } = this.props
    return(
      <React.Fragment>
        <Modal width="70%" height="90%" show>
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
              <LevelLeft>
                { this.state.renderCreate && 
                <Button kind="outline" onClick={ this.handleSave }>Reservar turno</Button> }
                { this.state.renderDetails &&
                  ( this.state.isSaving ? 
                    <Button kind="outline" disable icon={ faSpinner } pulse>Guardando..</Button> : 
                    <Button kind="outline" onClick={ this.handleSaveEdit } disabled={ this.getDisabled() }>Guardar</Button> ) }
              </LevelLeft>
              <LevelLeft>
                { this.state.renderCreate || this.state.renderDetails ?
                  <Button kind="link" onClick={ () => ( this.handleInformationAdvice('list') ) }>
                    <FontAwesomeIcon className="mr-2" icon={ faCalendarAlt }/>Ver los turnos de hoy</Button> : null }
                { this.state.renderList && 
                  <Button kind="link" onClick={ this.handleCreate }>
                    <FontAwesomeIcon className="mr-2" icon={ faCalendarAlt }/>Crear un turno para hoy</Button> }
              </LevelLeft>
            </Level>
          </ModalFooter>
        </Modal>
        { this.state.showPaymentModal    && this.renderPaymentModal() }
        { this.state.confirmation    && this.renderConfirmationModal() }
        { this.state.infoAdvice      && this.renderInformationAdvice() }
      </React.Fragment>)
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