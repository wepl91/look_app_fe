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
      points: 0,
      validSplitPayment: false
    }

    this.handleChange = this.handleChange.bind(this);
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  handlePaymentType( type ){
    this.setState({
      paymentType: type,
      cashHalf: 0,
      pointsHalf: 0,
      points: 0,
    })
    if(type == 'cashAndPoints'){
      this.props.onChange && this.props.onChange( null, null, 'cashHalf', null, this.getText('Los campos están vacíos') )    
    }else{
      this.props.onChange && this.props.onChange( null, null, type, null )    
    }

  }

  validateCashPayment( value ){
    return priceRegex.test(value) && value <= this.props.totalAmount
  }

  validatePointsPayment( value ){
    return priceRegex.test(value) && value <= this.props.clientPoints && this.getConvertedPoints(value) <= this.props.totalAmount
  }

  getConvertedPoints(points){
    return this.props.store.ui.getChange('changePurchase').convertPoints(points)
  }

  handleChange(sender, value, name, valid){
    let message = ''
    if(name =='cashHalf'){
      this.setState({
        cashHalf: value
      })
      let validCash = this.validateCashPayment( value )
      let validPoints = this.validatePointsPayment( this.state.pointsHalf )
      let doesNotExceedTotal = (value*1.0 + this.getConvertedPoints(this.state.pointsHalf)) <= this.props.totalAmount

      if(!validCash){
        message = this.getText('El monto en efectivo ingresado no es válido')
      }
      if(!validPoints){
        message = this.getText('Los puntos ingresados no son válidos')
      }
      if(validCash && validPoints && !doesNotExceedTotal){
        message = this.getText('El monto excede el total a pagar')
      }

      valid = validCash && validPoints && doesNotExceedTotal
    }
    if(name =='pointsHalf'){
      this.setState({
        pointsHalf: value
      })
      let validCash = this.validateCashPayment( this.state.cashHalf )
      let validPoints = this.validatePointsPayment( value )
      let doesNotExceedTotal = (this.state.cashHalf*1.0 + this.getConvertedPoints(value)) <= this.props.totalAmount
      if(!validCash){
        message = this.getText('El monto en efectivo ingresado no es válido')
      }
      if(!validPoints){
        message = this.getText('Los puntos ingresados no son válidos')
      }
      if(validCash && validPoints && !doesNotExceedTotal){
        message = this.getText('El monto excede el total a pagar')
      }
      valid = validCash && validPoints  && doesNotExceedTotal
    }
    if(name == 'points'){
      this.setState({
        points: value
      })
    }
    if(name =='pointsHalf' || name =='cashHalf'){
      if(this.state.cashHalf == 0 || this.state.pointsHalf == 0){
        message = this.getText('Los campos están vacíos')
      }
      this.props.onChange && this.props.onChange(sender, value, name, valid, message)
    }else{
      this.props.onChange && this.props.onChange(sender, value, name, valid)    
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
              { this.getText('Fiar') }
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
         <TextInput icon={ faMoneyBill } name="cash" validate={ (value) => this.validateCashPayment(value) } onChange={ this.handleChange }/>}

         {this.state.paymentType == 'points' && 
         <React.Fragment>
          <TextInput icon={ faCoins } name="points" validate={ (value) => this.validatePointsPayment(value) } onChange={ this.handleChange }/>
          <Text className="has-text-centered" >{ `${ this.getText('(Equivale a: $') } ${this.getConvertedPoints(this.state.points)})` }</Text>
         </React.Fragment>}
         
         {this.state.paymentType == 'cashAndPoints' && 
          <React.Fragment>
            <Columns isGapless isMarginless isVCentered>
              <Column isSize={ 5 }>
                <TextInput className="is-fullwidth" icon={ faMoneyBill } name="cashHalf" onChange={ this.handleChange }/>
              </Column>
              <Column isSize={ 1 }>
                <Text className="has-text-centered">+</Text>
              </Column>
              <Column isSize={ 5 }>
              <React.Fragment>
                <TextInput className="mt-2 is-fullwidth" icon={ faCoins } name="pointsHalf" onChange={ this.handleChange }/>
                <Text className="has-text-centered" >{ `${ this.getText('(Equivale a: $') } ${this.getConvertedPoints(this.state.pointsHalf)})` }</Text>
              </React.Fragment>
              </Column>
              <Column>
                <Text>{ ` =  $ ${this.getConvertedPoints(this.state.pointsHalf) + this.state.cashHalf*1.0}` }</Text>
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