import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from '../../components/Checkbox'

import {
  Field,
  TextInput,
  Text,
  DateTimePicker,
  Panel
} from 'shipnow-mercurio';

import {
  Columns,
  Column
} from 'bloomer';

import startCase from 'lodash/startCase';

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

import { nameRegex, priceRegex } from '../../lib/Regex';

import { translate } from '../../lib/Translator';

import moment from 'moment';

@observer
class DiscountsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      services: null,
      type: this.props.discount.type || ' ',
      selectedServices: [],
      startingDate: this.props.discount ? this.props.discount.rawStartingDate || moment().subtract(7, 'days') : moment().subtract(7, 'days'),
      endingDate: this.props.discount ? this.props.discount.rawEndingDate || moment() : moment(),
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleServices = this.handleServices.bind(this);
    this.handleDate = this.handleDate.bind(this)
  }

  componentDidMount() {
    if (this.props.discount && this.state.selectedServices.length == 0) {
      this.setState({
        selectedServices: this.props.discount.discountServicesIds
      })
    }
    this.setState({
      services: this.props.store.services.search({}, 'services-discount-creation-view', true),
    })
    this.props.onChange && this.props.onChange('startDate', this.state.startingDate, true)
    this.props.onChange && this.props.onChange('endDate', this.state.endingDate, true);
  }

  handleChange(sender, value, name, valid) {
    this.props.onChange && this.props.onChange(name, value, valid);
  }

  handleBenefit( benefit ) {
    this.props.onChange && this.props.onChange('type', benefit, true);
    this.setState({
      type: benefit
    })
  }

  handleServices(value, checked) {
    let newArray = Array.from(this.state.selectedServices)
    if (!checked) {
      newArray = newArray.filter(item => item !== value.id)
    } else {
      newArray.push(value.id)
    }
    this.setState({
      selectedServices: newArray,
    });
    this.props.onChange && this.props.onChange('services', newArray, newArray.length !== 0)
  }

  handleDate( sender, value, name ){
    if(name == 'fromDate'){
      this.setState({
        startingDate: value,
      })
      this.props.onChange && this.props.onChange('startDate', value, moment(value).isBefore(moment(this.state.endingDate)));
    }else{
      this.setState({
        endingDate: value
      })
      this.props.onChange && this.props.onChange('endDate', value, moment(value).isAfter(moment(this.state.endingDate)));
    }
  }

  handleMultiplier( pointFactor ) {
    this.props.onChange && this.props.onChange('pointFactor', pointFactor, true);
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  areDatesValid(){
    return moment(this.state.startingDate).isBefore(moment(this.state.endingDate))
  }

  renderServices(){
    
  }

  renderSkeleton() {
    return (
      <React.Fragment>
        <Field label={ this.getText('Nombre') }>
              <TextInput name="name" className="is-fullwidth" disabled />
        </Field>
        <Field label={ this.getText('Desde') }>
          <DateTimePicker 
            name="fromDate" 
            disabled/>
        </Field>
        <Field label={ this.getText('Hasta') }>
          <DateTimePicker 
            name="toDate"
            disabled />
        </Field>
        <Field label={ this.getText('Beneficio') } labelNote={ this.getText('¿Qué tipo de beneficio ofrece la promoción?') }>
        <Columns isCentered isVCentered>
          <Column>
            <Text className="ml-1" size="md" weight="medium">
            <input 
              className="ml-1 mr-1" 
              type="radio" 
              value="DISCOUNT" 
              disabled
              />
              ...
              </Text>
              <Text className="ml-1 mt-1 mb-1" size="md" weight="medium">
              <input 
              className="ml-1 mr-1" 
              type="radio" 
              value="POINT" 
              disabled
              />
              ...
            </Text>
          </Column>
          <Column>
            { this.state.type == 'DISCOUNT' && 
            <Columns isCentered isVCentered>
              <Column>
              <TextInput name="discount" className="is-fullwidth" disabled />
              </Column>
              <Column>
                <Text className="is-fullwidth" >%</Text>
              </Column>
            </Columns>}
          </Column>
        </Columns>
        </Field>
        <Field label={ this.getText('¿Qué servicios incluye?') } labelNote={ this.getText('Seleccioná los servicios') }>
          <Checkbox className="pt-1 ml-1" checked={ false } >...</Checkbox>
          <Checkbox className="pt-1 ml-1" checked={ false } >...</Checkbox>
          <Checkbox className="pt-1 ml-1" checked={ false } >...</Checkbox>
        </Field>
      </React.Fragment>)
  }

  render() {
    const isServicesLoaded = this.state.services && this.state.services.isOk();
    if (!isServicesLoaded) {
      return this.renderSkeleton()
    }
    const { discount } = this.props;
    const { services } = this.state;
    return (
      <React.Fragment>
            <Field label={ this.getText('Nombre') }>
              <TextInput 
                value={ discount && discount.name } 
                name="name" 
                validate={ (value) => (nameRegex.test(value)) } 
                onChange={ this.handleChange } />
            </Field>
            <Field label={ this.getText('Desde') } labelNote={ this.getText('¿Cuándo inicia la promoción?')} >
              <DateTimePicker 
                name="fromDate" 
                onChange={ this.handleDate }
                value={ this.state.startingDate }/>
            </Field>
            <Field label={ this.getText('Hasta') } labelNote={ this.getText('¿Cuándo finaliza la promoción?')}>
              <DateTimePicker 
                name="toDate"
                onChange={ this.handleDate } 
                value={ this.state.endingDate } />
                { !this.areDatesValid() && 
                  <Panel 
                    className="mt-1 mr-3" 
                    color="error" 
                    invert 
                    style={{padding: '2px'}}>
                    <Text className="has-text-centered">{ this.getText('Los días ingresados son incorrectos') }</Text>
                  </Panel> }
            </Field>
            <Field label={ this.getText('Beneficio') } labelNote={ this.getText('¿Qué tipo de beneficio ofrece la promoción?') }>
            <Columns isCentered isVCentered>
              <Column>
                <Text className="ml-1 mt-1" size="md" weight="medium">
                    <input 
                      className="ml-1 mr-1" 
                      type="radio" 
                      value="DISCOUNT" 
                      onChange={ () => (this.handleBenefit('DISCOUNT')) }
                      checked={ discount && discount.type == 'DISCOUNT' } />
                    { this.getText('Descuento en el pago') }
                  </Text>
                  <Text className="ml-1 mt-1 mb-1" size="md" weight="medium">
                    <input 
                      className="ml-1 mr-1" 
                      type="radio" 
                      value="POINT" 
                      onChange={ () => (this.handleBenefit('POINT')) }
                      checked={ discount && discount.type == 'POINT' } />
                    { this.getText('Multiplicador de puntos') }
                </Text>
              </Column>
              <Column>
                { this.state.type == 'DISCOUNT' && 
                <Columns isCentered isVCentered>
                  <Column>
                  <TextInput 
                    value={ discount && discount.discount } 
                    name="discount" 
                    validate={ (value) => (priceRegex.test(value) && value <= 100 && value >= 1) } 
                    className="is-fullwidth ml-2 mb-3" 
                    onChange={ this.handleChange } />
                  </Column>
                  <Column>
                    <Text className="is-fullwidth mb-3" >%</Text>
                  </Column>
                </Columns>}
                { this.state.type == 'POINT' && <React.Fragment>
                <Columns  isCentered isVCentered>
                  <Column>
                    <Text className="ml-1" size="md" weight="medium">
                      <input 
                        className="ml-1 mr-1" 
                        type="radio" 
                        value={ 2 }
                        onChange={ () => this.handleMultiplier( 2 ) }
                        checked={ discount && discount.type == 'POINT' && discount.pointFactor == 2 } />
                        2x
                    </Text>
                  </Column>
                  <Column >
                    <Text className="ml-1" size="md" weight="medium">
                      <input 
                        className="ml-1 mr-1" 
                        type="radio" 
                        value={ 3 }
                        onChange={ () => this.handleMultiplier( 3 ) }
                        checked={ discount && discount.type == 'POINT' && discount.pointFactor == 3 } />
                        3x
                    </Text>
                  </Column>
                  <Column >
                    <Text className="ml-1" size="md" weight="medium">
                      <input 
                        className="ml-1 mr-1" 
                        type="radio" 
                        value={ 4 } 
                        onChange={ () => this.handleMultiplier( 4 ) }
                        checked={ discount && discount.type == 'POINT' && discount.pointFactor == 4 } />
                        4x
                    </Text>
                  </Column>
                  <Column >
                    <Text className="ml-1" size="md" weight="medium">
                      <input 
                        className="ml-1 mr-1" 
                        type="radio" 
                        value={ 5 } 
                        onChange={ () => this.handleMultiplier( 5 ) }
                        checked={ discount && discount.type == 'POINT' && discount.pointFactor == 5 } />
                        5x
                    </Text>
                  </Column>
                </Columns>
                </React.Fragment>}
              </Column>
            </Columns>
            </Field>
            <Field label={ this.getText('¿Qué servicios incluye?') } labelNote={ this.getText('Seleccioná los servicios') }></Field>
              {services.toArray().map(serv => (
                <Checkbox 
                  className="pt-1 ml-1" 
                  checked={ discount && discount.discountServicesIds.includes(serv.id)} 
                  value={ serv } 
                  onCheck={ this.handleServices }>
                  {this.getText(startCase(serv.name))}
                </Checkbox> ))}
      </React.Fragment> )
  }
}

DiscountsForm.PropTypes = {
  onChange: PropTypes.func,
  discount: PropTypes.object,
}

DiscountsForm.defaultProps = {
  onChange: null,
  discount: null,
}

export default withStore(DiscountsForm);