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
  Button,
  Text,
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
  faTimes, 
} from "@fortawesome/free-solid-svg-icons";

import { PaymentForm } from './';

import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { withStore } from '../../hocs';

import { ConfirmationModal } from '../ConfirmationModal';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

import { ReactComponent as SvgDraw } from '../../assets/undraw_Savings_dwkw.svg';

@observer
class PaymentsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmation: false,
      appointment: this.props.appointment,
      paymentType: '',
      cash: null,
      points: null,
      validCash: false,
      validPoints: false,
      validCashAndPoints: false,
      invalidMsg: '',
      confirmationData: {
        accept: null,
        cancel: null,
        title: null,
        content: null,
      }
    }

    this.handleConfirm       = this.handleConfirm.bind(this);
    this.handleCancelConfirm = this.handleCancelConfirm.bind(this);
    this.handlePay           = this.handlePay.bind(this);
    this.handlePaymentData   = this.handlePaymentData.bind(this);
  }

  handlePay( name ) {
    if( name=='cancelled' ){
      this.props.onPay && this.props.onPay('cancelled')
    }else if(this.state.paymentType == 'loaned'){
      this.state.appointment.loan().then( response =>{ this.props.onPay && this.props.onPay('paid', response) });
    }else{
      this.state.appointment.pay(this.state.cash,this.state.points).then( response =>{ this.props.onPay && this.props.onPay('paid', response) });
    }
  }

  handlePaymentData(sender, value, name, valid, message) {
    if(name == 'cash'){
      valid && valid.type == 'success' ? this.setState({cash: value, points: null, paymentType: 'cash', validCash: true}) : this.setState({ paymentType: 'cash', validCash: false, invalidMsg: message})
    }
    if(name == 'points'){
      valid && valid.type == 'success' ? this.setState({points: value, cash: null, paymentType: 'points', validPoints: true}) : this.setState({ paymentType: 'points', validPoints: false, invalidMsg: message})
    }
    if(name == 'cashHalf'){
      valid ? this.setState({cash: value, paymentType: 'cashAndPoints', validCashAndPoints: valid}) : this.setState({ paymentType: 'cashAndPoints', validCashAndPoints: false, invalidMsg: message})
    }
    if(name == 'pointsHalf'){
      valid ? this.setState({points: value, paymentType: 'cashAndPoints', validCashAndPoints: valid}) : this.setState({ paymentType: 'cashAndPoints', validCashAndPoints: false, invalidMsg: message})
    }
    if(name == 'loaned'){
      this.setState({points: null, cash: null, paymentType: 'loaned'})
    }
  }

  handleCancelConfirm() {
    this.setState({
      confirmation: false,
    })
  }

  handleConfirm( ) {
    let data = {};

    data['title']   = this.getText('Abonar turno');
    data['accept']  = this.handlePay;
    data['cancel']  = this.handleCancelConfirm;
    data['content'] = this.getText('Estás por efectuar el pago. ¿Estás seguro?');

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
    if(this.state.paymentType == 'cash'){
      return !this.state.validCash
    }
    if(this.state.paymentType == 'points'){
      return !this.state.validPoints
    }
    if(this.state.paymentType == 'cashAndPoints'){
      return !this.state.validCashAndPoints
    }
    if(this.state.paymentType == 'loaned'){
      return false
    }else{
      return true
    }
  }

  isValidPayment() {
    if(this.state.paymentType == 'cashAndPoints'){
      return this.state.validCashAndPoints
    }
    if(this.state.paymentType == 'cash'){
      return this.state.validCash
    }
    if(this.state.paymentType == 'points'){
      return this.state.validPoints
    }
    else{
      return true
    }
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  renderPartial() {
    const { appointment } = this.state;
    if (appointment.payments.length > 0) {
      let paid = 0;
      appointment.payments.forEach(payment => {
        paid += parseFloat(payment.amount);
      });
      return <Title size="md" className="mt-1 mb-1">{ `${ this.getText('Total abonado: $') } ${paid}` }</Title>
    }
    return null;
  }

  renderPending() {
    const { appointment } = this.state;
    if (appointment.payments.length > 0) {
      let paid = 0;
      appointment.payments.forEach(payment => {
        paid += parseFloat(payment.amount);
      });
      return <Title size="md" className="mt-1 mb-1">{ `${ this.getText('Total restante: $') } ${appointment.totalPrice - paid}` }</Title>
    }
    return null;
  }

  render() {
    const { date } = this.props
    const { appointment } = this.state
    return(
      <React.Fragment>
        <Modal width="70%" height="95%" show>
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
              <Columns>
                <Column isSize={ 5 }>
                  <Title size="md" className="mb-1">{ `${ this.getText('Total a abonar: $') } ${appointment.totalPrice}` }</Title>
                  { this.renderPartial() }
                  { this.renderPending() }
                  <Title className="mt-1" size="md">{ `${appointment.clientPoints}  ${ this.getText('puntos disponibles ') } ${ ' ($ '} ${ this.props.store.ui.getChange('changePurchase').convertPoints(appointment.clientPoints) }${ ')'}`}</Title>
                  <PaymentForm totalAmount={ appointment.totalPrice } clientPoints={ appointment.clientPoints } onChange={ this.handlePaymentData }></PaymentForm>
                  { !this.isValidPayment() && 
                  <Panel 
                    className="mt-1" 
                    color="error" 
                    invert 
                    style={{padding: '2px'}}>
                    <Text className="has-text-centered">{ this.state.invalidMsg }</Text>
                  </Panel> }
                </Column>
                <Column className="has-text-centered" isSize={ 7 }>
                  <SvgDraw style={{ height: '450px', width: '450px' }}/>
                </Column>
              </Columns>
            </ModalContent>
          <ModalFooter>
            <Level>
              <LevelLeft>
                  <Button kind="outline" name="paid" onClick={ this.handleConfirm } disabled={ this.getDisabled() }>{this.getText('Efectuar pago')}</Button>
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