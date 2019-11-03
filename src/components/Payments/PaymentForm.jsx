import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css'

import {
  Field,
  Text,
  TextInput
} from 'shipnow-mercurio';

import {
  Columns,
  Column
} from 'bloomer';

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

import { priceRegex } from '../../lib/Regex'

import { 
  faCoins,
  faMoneyBill
} from "@fortawesome/free-solid-svg-icons";

@observer
class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentType: '',
      cashHalf: 0,
      pointsHalf: 0,
      validSplitPayment: false
    }

    this.handleChange        = this.handleChange.bind(this);
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  handlePaymentType( type ){
    if(type == 'loaned'){
      this.props.onChange && this.props.onChange( null, null, type, null )    
    }
    this.setState({
      paymentType: type
    })
  }

  validateCashPayment( value ){
    //agregar mensaje de error
    return priceRegex.test(value) && value <= this.props.totalAmount
  }

  validatePointsPayment( value ){
    //una vez que tengamos conversion, validar que no se este excediendo del monto total


    //aparte de sto mostrar la equivalencia de puntos a dinero en algun lugar

    //y ver la validacion de efectivoypuntos que no se actualiza a tiempo
    return priceRegex.test(value) && value <= this.props.clientPoints
  }

  handleChange(sender, value, name, valid){
    if(name =='cashHalf'){
      this.setState({
        cashHalf: value
      })
    }
    if(name =='pointsHalf'){
      this.setState({
        pointsHalf: value
      })
    }
    
    this.props.onChange && this.props.onChange(sender, value, name, valid)    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.cashHalf != this.state.cashHalf || prevState.pointsHalf != this.state.pointsHalf ) {
      this.setState({
        validSplitPayment: this.validateCashPayment( this.state.cashHalf ) && this.validatePointsPayment( this.state.pointsHalf )
      })
    }
  }

  render() {
    return(
      <React.Fragment>
        <Field label={ this.getText('Tipo de pago') } labelNote={ this.getText('¿De qué manera desea realizar el pago?') } size="lg">
          <Text className="ml-1 mt-2" weight="medium" size="lg">
              <input 
                className="ml-1 mr-1" 
                type="radio" 
                value="loaned" 
                onChange={ () => (this.handlePaymentType('loaned')) }
                checked={ this.state.paymentType == 'loaned'} />
              { this.getText('Fiado') }
          </Text>
          <Text className="ml-1 mt-2" size="lg" weight="medium">
              <input 
                className="ml-1 mr-1" 
                type="radio" 
                value="cash" 
                onChange={ () => (this.handlePaymentType('cash')) }
                checked={ this.state.paymentType == 'cash'} />
              { this.getText('Efectivo') }
          </Text>
          <Text className="ml-1 mt-2" size="lg" weight="medium">
              <input 
                className="ml-1 mr-1" 
                type="radio" 
                value="points" 
                onChange={ () => (this.handlePaymentType('points')) }
                checked={ this.state.paymentType == 'points'} />
              { this.getText('Puntos') }
          </Text>
          <Text className="ml-1 mt-2" size="lg" weight="medium">
              <input 
                className="ml-1 mr-1" 
                type="radio" 
                value="cashAndPoints" 
                onChange={ () => (this.handlePaymentType('cashAndPoints')) }
                checked={ this.state.paymentType == 'cashAndPoints'} />
              { this.getText('Efectivo y puntos') }
          </Text>
        </Field>
        {this.state.paymentType != '' && this.state.paymentType != 'loaned' &&
        <Field className="mt-4" label={ this.getText('Ingrese los montos') } labelNote={ this.getText('¿Cuánto va abonar?') } size="lg">

         {this.state.paymentType == 'cash' && 
         <TextInput icon={ faMoneyBill } validate={ (value) => (this.validateCashPayment(value)) } name="cash" onChange={ this.handleChange }/>}

         {this.state.paymentType == 'points' && 
         <TextInput icon={ faCoins } validate={ (value) => (this.validatePointsPayment(value)) } name="points" onChange={ this.handleChange }/>}
         
         {this.state.paymentType == 'cashAndPoints' && 
          <React.Fragment>
            <Columns>
              <Column isSize={ 6 }>
                <TextInput className="mt-1" icon={ faMoneyBill } validate={ () => this.state.validSplitPayment } name="cashHalf" onChange={ this.handleChange }/>
              </Column>
              <Column isSize={ 6 }>
                <TextInput className="mt-1" icon={ faCoins } validate={ () => this.state.validSplitPayment } name="pointsHalf" onChange={ this.handleChange }/>
              </Column>
            </Columns>
          </React.Fragment>}
        </Field>}
      </React.Fragment> )
  }
}

PaymentForm.PropTypes = {
  totalAmount: PropTypes.number,
  clientPoints: PropTypes.number,
  onChange: PropTypes.func
}

PaymentForm.defaultProps = {
  totalAmount: 0,
  clientPoints: 0,
  onChange: null
}

export default withStore(PaymentForm);