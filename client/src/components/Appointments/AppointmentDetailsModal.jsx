import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withToastManager } from 'react-toast-notifications';
import { withStore } from '../../hocs';

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react';

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Title,
  Button,
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight,
  Column,
  Columns
} from 'bloomer'

import {  
  faTimes,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";

import { 
  AppointmentsForm 
} from './';

import {
  PaymentModal
} from '../Payments';

@observer
class AppointmentDetailsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPayModal: false,
    }

    this.handleClose = this.handleClose.bind(this);
    this.handlePay   = this.handlePay.bind(this);
    this.handlePayModal = this.handlePayModal.bind(this);
  }

  handlePay( name ) {
    if(name == "paid"){
      this.setState(prevState => ({
        showPayModal: !prevState.showPayModal
      }), () => (this.props.onClose && this.props.onClose(true)) )
    }
    this.setState(prevState => ({
      showPayModal: !prevState.showPayModal
    }))
  }

  handlePayModal() {
    this.setState( prevState => ({
      showPayModal: !prevState.showPayModal
    }))
  }

  handleClose() {
    this.props.onClose && this.props.onClose()
  }
  
  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  renderPaymentModal() {
    const { appointment } = this.props;
    return <PaymentModal appointment={ appointment } onPay={ this.handlePay }/>
  }
  
  render() {
    const { appointment } = this.props;
    return(
      <React.Fragment>
        <Modal show width="60%">
          <ModalHeader>
            <Level>
              <LevelLeft>
                <Title>{this.getText('Detalles del turno')}</Title>
              </LevelLeft>
              <LevelRight>
                <Button icon={ faTimes } kind="link" onClick={ this.handleClose } />
              </LevelRight>
            </Level>
          </ModalHeader>
          <ModalContent>
            <Columns>
              <Column>
                <AppointmentsForm canNotEdit appointment={ appointment }/>
              </Column>
              <Column className="has-text-centered">
              { (appointment.isPartialPaid || appointment.isOpen) &&
                <Button 
                  className="mt-2" 
                  kind="link" 
                  icon={ faMoneyBill } 
                  onClick={ this.handlePayModal }>{ this.getText('Efectuar pago') }</Button> }
              </Column>
            </Columns>
          </ModalContent>
          <ModalFooter>
          </ModalFooter>
        </Modal>
        { this.state.showPayModal && this.renderPaymentModal() }
      </React.Fragment>)
  }
}

AppointmentDetailsModal.PropTypes = {
  appointment: PropTypes.object,
  onClose: PropTypes.func,
}

AppointmentDetailsModal.defaultProps = {
  appointment: null,
  onClose: null,
}

export default withStore(withToastManager(AppointmentDetailsModal))