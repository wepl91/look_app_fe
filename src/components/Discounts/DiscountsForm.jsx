import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from '../../components/Checkbox'

import {
  Field,
  TextInput,
  Text,
  Panel,
  Select
} from 'shipnow-mercurio';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import startCase from 'lodash/startCase';

import { withStore } from '../../hocs';

import moment from 'moment';

import { observer } from 'mobx-react';

import { nameRegex, priceRegex } from '../../lib/Regex';

import { translate } from '../../lib/Translator';

@observer
class DiscountsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      services: null,
      // branches: null,
      selectedServices: [],
      validDates: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleHours = this.handleHours.bind(this);
    this.handleServices = this.handleServices.bind(this);
  }

  componentDidMount() {
    if (this.props.discount && this.state.selectedServices.length == 0) {
      this.setState({
        selectedServices: this.props.discount.discountServicesIds
      })
    }
    this.setState({
      services: this.props.store.services.search({}, 'services-discount-creation-view', true),
      // branches: this.props.store.branches.search({}, 'branches-discount-creation-view', true),
    })
  }

  handleChange(sender, value, name, valid) {
    this.props.onChange && this.props.onChange(name, value, valid);
  }

  // handleHours(received, valid, name ) {
  //   name = 'hours'
  //   this.setState({
  //     days: received,
  //   }) 
  //   let ret = []
  //   valid = true
  //   if(Object.keys(received).length > 0){
  //     for (const [day, hours] of Object.entries(received)) {
  //       if(hours['sta'] && hours['fin']){ 
  //         ret.push({
  //           "days": day,
  //           "beginHour": hours['sta'].substring(0, 2),
  //           "endHour": hours['fin'].substring(0, 2)
  //         })
  //         if(!(moment(hours['sta'],'HH:mm').isBefore(moment(hours['fin'],'HH:mm')))){
  //           valid = false
  //         }
  //       }else{
  //         valid = false
  //       }
  //     }
  //   }else{
  //     valid = false
  //   }

  //   this.setState({validTimeRange: valid})
  //   this.props.onChange && this.props.onChange(name, ret, valid);
  // }

  // isValidHour() {
  //   if(Object.keys(this.state.days).length > 0){
  //     return this.state.validTimeRange
  //   }
  //   return true
  // }

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

  // renderSkeleton() {
  //   return (
  //     <React.Fragment>
  //       <Field className="pl-5 pr-5" label={ this.getText('Nombre') }>
  //         <TextInput name="name" className="is-fullwidth" disabled />
  //       </Field>
  //       <Field className="pl-5 pr-5" label={ this.getText('Apellido') }>
  //         <TextInput name="lastName" className="is-fullwidth" disabled />
  //       </Field>
  //       <Field className="pl-5 pr-5" label={ this.getText('Teléfono') }>
  //         <TextInput name="phone" className="is-fullwidth" disabled />
  //       </Field>
  //       <Field className="pl-5 pr-5" label={ this.getText('Email') }>
  //         <TextInput name="email" className="is-fullwidth" disabled />
  //       </Field>
  //       <Field className="pl-5 pr-5" label={ this.getText('Email') }>
  //         <Select name="branch" className="is-fullwidth" disabled />
  //       </Field>
  //       <Field className="pl-5 pr-5" label={ this.getText('¿Qué servicios ofrece?') } labelNote={ this.getText('Seleccioná los servicios') }>
  //         <Checkbox className="pt-1" checked={ false } >...</Checkbox>
  //         <Checkbox className="pt-1" checked={ false } >...</Checkbox>
  //         <Checkbox className="pt-1" checked={ false } >...</Checkbox>
  //       </Field>
  //     </React.Fragment>)
  // }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const isServicesLoaded = this.state.services && this.state.services.isOk();
    // const isBranchesLoaded = this.state.branches && this.state.branches.isOk()
    // if (!isServicesLoaded || !isBranchesLoaded) {
    //   return this.renderSkeleton()
    // }
    if (!isServicesLoaded) {
      return this.renderSkeleton()
    }
    const { discount } = this.props;
    const { services } = this.state;
    return (
      <React.Fragment>
            <Field className="pl-4 pr-4" label={ this.getText('Nombre') }>
              <TextInput 
                value={ discount && discount.name } 
                name="name" 
                validate={ (value) => (nameRegex.test(value)) } 
                className="is-fullwidth" 
                onChange={ this.handleChange } />
            </Field>
            <Field className="pl-4 pr-4" label={ this.getText('Discount') }>
              <TextInput 
                value={ discount && discount.discount } 
                name="phone" 
                validate={ (value) => (priceRegex.test(value)) } 
                className="is-fullwidth" 
                onChange={ this.handleChange } />
            </Field>
            <Field className="pl-4 pr-4" label={ this.getText('Multiplier') }>
              <TextInput 
                value={ discount && discount.email } 
                name="email" 
                validate={ (value) => (priceRegex.test(value)) } 
                className="is-fullwidth" 
                onChange={ this.handleChange } />
            </Field>
            {/* <Field className="pl-4 pr-4" label={ this.getText('¿En qué sucursal va a atender?') } labelNote={ this.getText('Seleccioná una sucursal') }>
              <Select 
                value={ professional && professional.cookedBranchId }
                key={ this.state.branches }
                className="is-fullwidth" 
                placeholder="Sucursales" 
                name="branch" 
                borderless 
                icon={ faChevronDown } 
                options={ this.state.branches.toArray().map(branch => ({key: branch.name || branch.cookedAddress, value: branch.id})) } 
                onChange={ this.handleChange } />
            </Field>  */}
            <Field className="pl-4 pr-4 pt-1" label={ this.getText('¿Qué servicios incluye?') } labelNote={ this.getText('Seleccioná los servicios') }>
              {services.toArray().map(serv => (
                <Checkbox 
                  className="pt-2" 
                  checked={ discount && discount.discountServicesIds.includes(serv.id)} 
                  value={ serv } 
                  onCheck={ this.handleServices }>
                  {this.getText(startCase(serv.name))}
                </Checkbox> ))}
            </Field>
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