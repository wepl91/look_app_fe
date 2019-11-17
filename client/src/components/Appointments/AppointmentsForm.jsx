import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css'

import {
  Field,
  Select,
  SelectItem,
  DateTimePicker,
  Text,
  Panel,
} from 'shipnow-mercurio';

import { Checkbox } from '../../components/Checkbox'

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

import startCase from 'lodash/startCase';

import moment from 'moment';

import { translate } from '../../lib/Translator';

import { ClientSuggest, ProfessionalSuggest } from '../../components/Suggest';

import { HourSelector } from '../../components/ObservableSelect'

@observer
class AppointmentsForm extends Component {
  constructor(props) {
    super(props);

    this.handleProfessional = this.handleProfessional.bind(this);
    this.handleServices     = this.handleServices.bind(this);
    this.handleClient       = this.handleClient.bind(this);
    this.handleBranch       = this.handleBranch.bind(this); 
    this.handleDate         = this.handleDate.bind(this);
    this.handleHour         = this.handleHour.bind(this);

    this.state = {
      branch: this.props.appointment ? this.props.appointment.branch : null,
      professional: this.props.appointment ? this.props.appointment.professional : 'null',
      professionals: this.props.appointment ? this.props.appointment.branch : null,
      clients: null,
      client: this.props.appointment ? this.props.appointment.client : 'null',
      date: this.props.appointment ? this.props.appointment.dayHour : moment(),
      selectedServices: this.props.appointment ? this.props.appointment.servicesIds : [],
      subtotal: this.props.appointment ? this.props.appointment.totalPrice : 0,
    }
  }

  componentDidMount() {
    // const searchFilter = value != 'null' ? { professional: value } : {}
    const searchFilter = {date: this.state.date}
    this.setState({
      branches: this.props.store.branches.search({}, 'branches-appointment-list-view', true),
      clients: !this.props.edit ? this.props.store.clients.search({}, 'clients-appointment-list-view', true) : null,
      discounts: this.props.store.discounts.search(searchFilter, 'discount-list-view', true)
    })
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.selectedServices !== prevState.selectedServices) {
      this.setState({subtotal: this.getSubtotal()})
    }
    if (this.state.professional !== prevState.professional) {
      this.setState({selectedServices: []})
    }
  }

  handleClient( value ) {
    if (value != 'null') {
      this.props.onChange && this.props.onChange('client', value.id);
    }
  } 

  handleHour( sender, value, name ) {
    this.props.onChange && this.props.onChange('hour', value);
  }

  handleDate( sender, value, name ) {
    this.setState({
      date: value
    })
    this.props.onChange && this.props.onChange('date', value);
  }

  handleBranch( sender, value, name ) {
    const branch = this.state.branches.toArray().find( branch => {
      return branch.id == value;
    });
    this.setState({
      professional: null,
      professionals: branch.professionals,
      branch: branch,
    });
    this.props.onChange && this.props.onChange('branch', value);
  }

  handleProfessional( value ) {
    const { appointment } = this.props;
    if( appointment.professional && value != appointment.professional.id){
        this.props.appointment.services = []
    }
    if (value == 'null' || !value) {
      this.setState({
        professional: null,
      });
      this.props.onChange && this.props.onChange('professional', null);
    }
    else {
      this.setState({
        professional: value,
      });
      this.props.onChange && this.props.onChange('professional', value.id);
    }
  }

  handleServices( serviceId, servicePrice ) {
    let newArray = Array.from(this.state.selectedServices)
    if(newArray.includes(serviceId)){
      newArray = newArray.filter(item => item !== serviceId)
    }else{
      newArray.push(serviceId)
    }
    this.setState({
      selectedServices: newArray,
    });
    this.props.onChange && this.props.onChange('services', newArray)
  }

  getSubtotal() {
    let ret = 0;
    this.state.branch.allServices.forEach( service => {
      if (this.state.selectedServices.includes(service.id)) {
        ret = ret + service.price
      }
    });
    return ret;
  }

  getBranchesList() {
    const list = [];
    this.state.branches.toArray().forEach( branch => {
      if (branch.isActive) {
        list.push(
          <SelectItem value={ branch.id } key={ branch.id }>
            { `${ startCase(branch.name) || branch.cookedAddress }` }
          </SelectItem>);
      }
    });

    return list;
  }

  isServiceInAppointment( serviceID ) {
    const { appointment } = this.props;
    let ret = false;
    if (!appointment) {
      return ret;
    }
    appointment.services.forEach( service => {
      if (service.id == serviceID) {
        ret = true;
      }
    });
    return ret;
  }

  hashString( received ){
    var hash = 0, i, chr;
    if (received.length === 0) return hash;
    for (i = 0; i < received.length; i++) {
      chr   = received.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  availableProfessionals(){
    if(this.state.branch){
      //siempre en inglés por las dudas que cambiemos algo al traducir
      return this.state.branch.filterProfessionals(this.state.date.locale('en').format('dddd'))
    }else{
      return null
    }
  }
  
  renderServices() {
    // El randomizer lo que hace es cambiar la key para que React vea que ocurrió un cambio en el checkbox. No usé Math.Random() por que rompía el Checkbox
    const { professional } = this.state;
    const services = professional && professional != 'null' ?  professional.services : this.state.branch && this.state.branch.allServices;
    let randomizer = professional && professional != 'null' ?  this.hashString(professional.name) : 1000;

    if (!services) return null;

    return(
      <Field className="ml-5" label={ this.getText('¿Cuál de nuestros servicios requerís?') } labelNote={ this.getText('Seleccioná un servicio') }>
        { services.length > 0 ? 
            services.map( service => ( 
              <Checkbox 
                disabled={ this.props.canNotEdit }
                key={ service.id + randomizer } 
                className="mt-2" checked={ this.isServiceInAppointment(service.id) } 
                onCheck={() => this.handleServices(service.id, service.price)}>
                {`${ startCase(service.name) } - $${ service.price }`}
              </Checkbox> )) : 
          <Text size="md" weight="medium" className="ml-2 mt-1">{ this.getText('No hay servicios existentes para ofrecer.') }</Text> }
          {this.renderSubtotal()}
      </Field> )   
  }

  renderSubtotal(){
    let discountedSubtotal = this.state.subtotal
    let list = [];
    this.state.discounts.toArray().forEach( discount => {
      if (discount.isActive) {
        discount.services.forEach( discountedService =>{
          if(this.state.selectedServices.includes(discountedService.id)){
            if(discount.type == 'DISCOUNT'){
              discountedSubtotal = discountedSubtotal - ((discountedService.price * discount.discount)/100)
              list.push(
                <Panel className="has-text-centered mr-3 ml-3 mt-1" invert color="success" style={{ padding: '2px' }}>
                  <Text size="md" weight="medium">{ `${this.getText('Promoción ')} "${ discount.name }" (${ discount.discount }${ this.getText('% de descuento en ')} ${discountedService.name})` }</Text>
                </Panel>)
            }
            if(discount.type == 'POINT'){
              list.push(
                <Panel className="has-text-centered mr-3 ml-3 mt-1" invert color="success" style={{ padding: '2px' }}>
                  <Text size="md" weight="medium">{ `${this.getText('Promoción ')} "${ discount.name }" :${ this.getText('los puntos del turno se multiplican por ') } ${ discount.pointFactor}` }</Text>
                </Panel>)
            }
          }
        })
      }
    });
    return(
      <React.Fragment>
        {list}
        <Text className="has-text-centered ml-2" weight="medium" color="primaryDark"><hr id="subtotalLine"/>Subtotal: ${discountedSubtotal}</Text>
      </React.Fragment>
    )
  }

  renderClients() {
    const { appointment, edit, canNotEdit } = this.props;
    return(
      <Field className="ml-5" label={ this.getText('¿Quién quiere ser atendido?') } labelNote={ this.getText('Seleccioná un cliente') }>
        <ClientSuggest 
          disabled={ edit || canNotEdit } 
          value={ appointment ? appointment.client : null } 
          onChange={ this.handleClient } 
          clients={ this.state.clients && this.state.clients.toArray() }/>
      </Field>);
  }

  renderBranches() {
    const {  canNotEdit } = this.props;
    return(
      <Field className="ml-5" label={ this.getText('¿A cual de nuestras sucursales querés venir?') } labelNote={ this.getText('Seleccioná una sucursal') }>
        <Select
          disabled={ canNotEdit }
          key={ this.state.branches }
          placeholder={ this.getText('Sucursales') } 
          borderless 
          icon={ faChevronDown } 
          className="is-fullwidth" 
          onChange={ this.handleBranch }
          value={ this.state.branch ? this.state.branch.id : null }
          options={ this.getBranchesList() } />
      </Field>)
  }

  renderDatePicker() {
    if (!this.props.withDate) return null;
    return(
      <Field className="ml-5" label={ this.getText('¿Que día querés venir?') } labelNote={ this.getText('Seleccioná una fecha') }>
        <DateTimePicker 
          className="is-fullwidth"
          key={ this.state.date } 
          value={ this.state.date } 
          onChange={ this.handleDate }/>
        { this.state.date.isoWeekday() == 7 && this.renderAdvise() }
      </Field>)
  }

  renderHourPicker() {
    const isDisabled = !this.state.branch;
    const { appointment, canNotEdit } = this.props;
    //puedo poner el value en el state y en un component did update si cambia la sucursal o el profesional o el dia, poner el value en null
    return(
      <Field className="ml-5" label={ this.getText('¿A que hora querés venir?') } labelNote={ this.getText('Seleccioná un horario') }>
      <HourSelector
          key={ this.state.branch } 
          disabled={ isDisabled || canNotEdit }
          onChange={ this.handleHour } 
          value={ appointment && appointment.beginningTime }
          professional={ this.state.professional }
          branch={ this.state.branch }
          day={ this.state.date.locale('en').format('dddd') }/>
      </Field>)
  }

  renderProfessionals() {
    const isDisabled = !this.state.branch;
    const { canNotEdit } = this.props;

    return(
      <Field className="ml-5" label={ this.getText('¿Por quién querés ser atendido?') } labelNote={ this.getText('Seleccioná un profesional') }>
          <ProfessionalSuggest 
            key={ this.state.branch } 
            disabled={ isDisabled || canNotEdit} 
            onChange={ this.handleProfessional }
            professionals={ this.availableProfessionals() } 
            value={ this.state.professional } />
      </Field>)
  }

  renderAdvise() {
    return(
      <Panel className="has-text-centered mr-3 mt-1" invert color="error" style={{ padding: '2px' }}>
        <Text size="sm" weight="medium">{ this.getText('La fecha seleccionada es un día no laboral.') }</Text>
      </Panel> )
  }

  renderSkeleton() {
    return(
    <React.Fragment>
      { this.props.withDate &&
        <Field className="ml-5" label={ this.getText('¿Que día querés venir?') } labelNote={ this.getText('Seleccioná uva fecha') }>
          <DateTimePicker className="is-fullwidth" disabled/>
        </Field> }
      <Field className="ml-5" label={ this.getText('¿Quién quiere ser atendido?') } labelNote={ this.getText('Seleccioná un cliente') }>
        <Select 
          disabled
          placeholder={ this.getText('Clientes') } 
          borderless 
          icon={ faChevronDown } />
      </Field>
      <Field className="ml-5" label={ this.getText('¿A cual de nuestras sucursales querés venir?') } labelNote={ this.getText('Seleccioná una sucursal') }>
        <Select 
          disabled
          placeholder={ this.getText('Sucursales') } 
          borderless 
          icon={ faChevronDown } 
          disabled
          loading />
      </Field>
      <Field className="ml-5" label={ this.getText('¿Por quién querés ser atendido?') } labelNote={ this.getText('Seleccioná un profesional') }>
        <Select 
          placeholder="Profesionales" 
          borderless 
          icon={ faChevronDown } 
          disabled
          loading />
      </Field>
      { this.props.edit && 
        <Field className="ml-5" label={ this.getText('¿Cual de nuestros servicios requeris?') } labelNote={ this.getText('Seleccioná un servicio') }>
          <Checkbox className="pt-1" checked={ false } >...</Checkbox>
          <Checkbox className="pt-1" checked={ false } >...</Checkbox>
          <Checkbox className="pt-1" checked={ false } >...</Checkbox>
        </Field> }
      <Field className="ml-5 mt-2" label={ this.getText('¿A que hora querés venir?') } labelNote={ this.getText('Seleccioná un horario') }>
        <Select 
          maxHeight="120px" 
          placeholder={ this.getText('Horarios') } 
          borderless 
          icon={ faChevronDown }
          disabled
          loading/>
      </Field>
    </React.Fragment>)
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const isBranchesLoaded = this.state.branches && this.state.branches.isOk();
    const clientsLoaded = !this.props.edit ? this.state.clients && this.state.clients.isOk() : true;
    const isDiscountsLoaded = this.state.discounts && this.state.discounts.isOk();
    
    if (!isBranchesLoaded || !clientsLoaded || !isDiscountsLoaded) {
      return this.renderSkeleton();
    }
    
    return(
      <React.Fragment>
        { this.renderDatePicker()    }
        { this.renderClients()       }
        { this.renderBranches()      }
        { this.renderProfessionals() }
        { this.renderServices()      } 
        { this.renderHourPicker()    }
      </React.Fragment> )
  }
}

AppointmentsForm.PropTypes = {
  withDate: PropTypes.bool,
  appointment: PropTypes.object,
  edit: PropTypes.bool,
  canNotEdit: PropTypes.bool,
}

AppointmentsForm.defaultProps = {
  withDate: false,
  appointment: null,
  edit: false,
  canNotEdit: false,
}

export default withStore(AppointmentsForm);