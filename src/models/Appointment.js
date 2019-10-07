import { Model } from '../lib';

import {
  action,
  computed,
} from 'mobx'

import moment from 'moment';
import startCase from 'lodash/startCase';

export default class Appointment extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      local: 'casa',
      status: "OPEN",
      professional: '',
      client: null,
      dayHour: '',
      services: [], 
    };
    
    let attrs = Object.assign( defaultAttributes, attributes );
    
    super(attrs, store);
    
    
  }
  
  afterSetData() {
    if (this.dayHour) {
      this.dayHour = moment(this.dayHour);
    }
  }

  @action
  setStatus( status ) {
    this.beginUpdate();
    this.status.name = status;
    this.endUpdate();
    return this;  
  }

  @computed
  get clientFullName() {
    if (!this.client) {
      return '';
    }
    return `${ startCase(this.client.name) } ${ startCase(this.client.surname) }`
  }

  @computed
  get totalPrice() {
    let total = 0;
    if (!this.services || this.services.length == 0) {
      return 0;
    }

    this.services.map( service => ( total += parseInt(service.price) ));

  }

  @computed
  get isOpen() {
    return this.status.name === 'OPEN';
  }

  @computed
  get isPaid() {
    return this.status.name === 'PAID';
  }

  @computed
  get isCancelled() {
    return this.status.name === 'CANCELED';
  }

  @computed
  get isCancelled() {
    return this.status.name === 'EXPIRED';
  }

  @computed
  get statusClassName() {
    const classNames = {
      'OPEN': 'open',
      'PAID': 'approved',
      'CANCELED': 'cancelled',
      'EXPIRED': 'cancelled'
    }

    return classNames[this.status.name];
  }

  @computed
  get hour() {
    return this.dayHour.format("HH:mm");
  }

}