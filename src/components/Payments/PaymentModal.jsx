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
  Text
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
      cash: 0,
      points: 0,
      validCash: false,
      validPoints: false,
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
    this.handlePaymentData         = this.handlePaymentData.bind(this);
  }

  handlePay( name ) {
    if( name=='cancelled' ){
      this.props.onPay && this.props.onPay('cancelled')
    }else{
      //realizar el pago correspondiente y mandar la response de vuelta al appointment modal
      // ver el state: si el paymenttype es cash, hacerlo en efectivo. si es points en puntos. si es cashAndPoints hacerlo con los dos, si es fiado hacer la request correspondiente
      // fijarse ademas si lo que estoy enviando suma el total del pago a realizar o si es parcial
      // this.state.appointment.pay().then( response =>{ this.props.onPay && this.props.onPay('paid', response) });
    }
  }

  handlePaymentData(sender, value, name, valid) {
    if(name == 'cash'){
      valid.type == 'success' ? this.setState({cash: value, paymentType: 'cash', validCash: true}) : this.setState({ validCash: false })
    }
    if(name == 'points'){
      valid.type == 'success' ? this.setState({points: value, paymentType: 'points', validPoints: true}) : this.setState({ validPoints: false })
    }
    if(name == 'cashHalf'){
      valid.type == 'success' ? this.setState({cash: value, paymentType: 'cashAndPoints', validCash: true}) : this.setState({ validCash: false })
    }
    if(name == 'pointsHalf'){
      valid.type == 'success' ? this.setState({points: value, paymentType: 'cashAndPoints', validPoints: true}) : this.setState({ validPoints: false })
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
    if(this.state.paymentType == 'cash'){
      return !this.state.validCash
    }
    if(this.state.paymentType == 'points'){
      return !this.state.validPoints
    }
    if(this.state.paymentType == 'cashAndPoints'){
      return !(this.state.validCash && this.state.validPoints)
    }
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const { date } = this.props
    const { appointment } = this.state
    return(
      <React.Fragment>
        <Modal width="70%" height="90%" show>
          <ModalHeader>
            <Level>
              <LevelLeft>
                <Title>{ `${ moment(date).format('LL') }` }</Title>
                <Text>{ `${ this.getText('Total a abonar: $') } ${appointment.totalPrice}` }</Text>
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
                  <PaymentForm totalAmount={ appointment.totalPrice } clientPoints={ appointment.clientPoints } onChange={ this.handlePaymentData }></PaymentForm>
                </Column>
                <Column className="has-text-centered" isSize={ 7 }>
                  <SvgDraw style={{ height: '450px', width: '450px' }}/>
                </Column>
              </Columns>
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