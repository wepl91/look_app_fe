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
      
    };
    
    let attrs = Object.assign( defaultAttributes, attributes );
    
    super(attrs, store);
    
    
  }
  
  afterSetData() {
    if (this.dayHour) {
      this.dayHour = moment(this.dayHour);
    }
  }

  @computed
  get status() {
    return this.appointmentStatus.name;
  }


  @action
  setStatus( status ) {
    this.beginUpdate();
    this.appointmentStatus.name = status;
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
  get isOpen() {
    return this.appointmentStatus.name === 'OPEN';
  }

  @computed
  get isClosed() {
    return this.appointmentStatus.name === 'CLOSE';
  }

  @computed
  get statusClassName() {
    const classNames = {
      'OPEN': 'open',
      'APPROVED': 'approved',
      'CANCELLED': 'cancelled'
    }

    return classNames[this.status];
  }

  @computed
  get hour() {
    return this.dayHour.format("HH:mm");
  }

}