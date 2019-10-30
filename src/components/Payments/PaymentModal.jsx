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

import { PaymentForm } from './';

import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { Appointment } from '../../models';

import { withStore } from '../../hocs';

import { ConfirmationModal } from '../ConfirmationModal';

import './styles.css';

class PaymentsModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      buttonDisabled: true,
      confirmation: false,
      appointment: this.props.appointment,
      confirmationData: {
        accept: null,
        cancel: null,
        title: null,
        content: null,
      }
    }

    this.handleConfirm         = this.handleConfirm.bind(this);
    this.handleCancelConfirm = this.handleCancelConfirm.bind(this);
    this.handlePay         = this.handlePay.bind(this);
    // this.handleSave          = this.handleSave.bind(this);

    // this.handlePay           = this.handlePay.bind(this);
    // this.handleCancel        = this.handleCancel.bind(this);
    // this.handleCancelAdvice  = this.handleCancelAdvice.bind(this);
  }

  handlePay( name ) {
    if( name=='cancelled' ){
      this.props.onPay && this.props.onPay('cancelled')
    }else{
      this.state.appointment.pay().then( response =>{ this.props.onPay && this.props.onPay('paid', response) });
    }
  }

  handleCancelConfirm() {
    this.setState({
      confirmation: false,
    })
  }

  handleConfirm( ) {
    let data = {};

    data['title']   = 'Abonar turno';
    data['accept']  = this.handlePay;
    data['cancel']  = this.handleCancelConfirm;
    data['content'] = 'Estás por efectuar el pago. ¿Estás seguro?';

    this.setState({
      confirmation:true,
      confirmationData: data,
    });
  }

  renderConfirmationModal() {
    const { confirmationData } = this.state;
    return (<ConfirmationModal 
              title=   { confirmationData.title   }
              content= { confirmationData.content } 
              onAccept={ confirmationData.accept  } 
              onCancel={ confirmationData.cancel  } />)
  }

  getDisabled() {
    // return this.state.appointment && !(this.state.appointment.services.length > 0 && !this.state.buttonDisabled)
    return false
  }

  render() {
    const { date } = this.props
    return(
      <React.Fragment>
        <Modal width="70%" height="90%" show>
          <ModalHeader>
            <Level>
              <LevelLeft>
                <Title>{ `${ moment(date).format('LL') }` }</Title>
              </LevelLeft>
              <LevelRight>
              <Button icon="plus" name="cancelled" kind="link" size="xl" onClick={() => this.handlePay('cancelled') }>
                <FontAwesomeIcon icon={ faTimes }/>
              </Button>
              </LevelRight>
              </Level>
          </ModalHeader>
          <ModalContent>
              <PaymentForm></PaymentForm>
            </ModalContent>
          <ModalFooter>
            <Level>
              <LevelLeft>
                  <Button kind="outline" name="paid" onClick={ this.handleConfirm } disabled={ this.getDisabled() }>Pagar</Button>
              </LevelLeft>
            </Level>
          </ModalFooter>
        </Modal>
        { this.state.confirmation && this.renderConfirmationModal() }
      </React.Fragment>)
  }
}
PaymentsModal.PropTypes = {
  date: PropTypes.object,
  onPay: PropTypes.func,
  appointment: PropTypes.object
}

PaymentsModal.defaultProps = {
  date: null,
  onPay: null,
  appointment: null
}

export default withToastManager(withStore(PaymentsModal));