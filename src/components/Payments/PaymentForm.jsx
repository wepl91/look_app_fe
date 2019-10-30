import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css'

import {
  Field,
  Text,
} from 'shipnow-mercurio';

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

@observer
class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentAmount: '',
      paymentType: '',
    }
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  handlePaymentAmount( amount ){
    this.setState({
      paymentAmount: amount
    })
  }

  handlePaymentType( type ){
    this.setState({
      paymentType: type
    })
  }

  render() {
    // const { appointment } = this.props;
    return(
      <React.Fragment>
        <Field label={ this.getText('Monto del pago') } labelNote={ this.getText('¿Qué monto desea abonar?') }>
          <Text className="ml-1" size="md" weight="medium">
            <input 
              className="ml-1 mr-1" 
              type="radio" 
              value="total" 
              onChange={ () => (this.handlePaymentAmount('total')) }
              checked={ this.state.paymentAmount == 'total' } />
            { this.getText('Total') }
          </Text>
          <Text className="ml-1" size="md" weight="medium">
            <input 
              className="ml-1 mr-1" 
              type="radio" 
              value="parcial" 
              onChange={ () => (this.handlePaymentAmount('parcial')) }
              checked={ this.state.paymentAmount == 'parcial' } />
            { this.getText('Parcial') }
          </Text>
        </Field>
        <Field label={ this.getText('Tipo de pago') } labelNote={ this.getText('¿De qué manera desea realizar el pago?') }>
          <Text className="ml-1" size="md" weight="medium">
              <input 
                className="ml-1 mr-1" 
                type="radio" 
                value="efectivo" 
                onChange={ () => (this.handlePaymentType('efectivo')) }
                checked={ this.state.paymentType == 'efectivo'} />
              { this.getText('Efectivo') }
          </Text>
          <Text className="ml-1" size="md" weight="medium">
              <input 
                className="ml-1 mr-1" 
                type="radio" 
                value="puntos" 
                onChange={ () => (this.handlePaymentType('puntos')) }
                checked={ this.state.paymentType == 'puntos'} />
              { this.getText('Puntos') }
          </Text>
          <Text className="ml-1" size="md" weight="medium">
              <input 
                className="ml-1 mr-1" 
                type="radio" 
                value="efectivoYPuntos" 
                onChange={ () => (this.handlePaymentType('efectivoYPuntos')) }
                checked={ this.state.paymentType == 'efectivoYPuntos'} />
              { this.getText('Efectivo y puntos') }
          </Text>
        </Field>
      </React.Fragment> )
  }
}

PaymentForm.PropTypes = {

}

PaymentForm.defaultProps = {

}

export default withStore(PaymentForm);