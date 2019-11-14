import { Model } from '../lib';
import {
  action,
  computed,
} from 'mobx'

import { 
  Appointment
} from '../models';

import { 
  AppointmentsStore
} from '../stores'

export default class Movement extends Model {
  constructor( attributes, store ) {
    super(attributes, store);
  }

  afterSetData() {
    if (this.appointment) {
      this.appointment = new Appointment(this.appointment, AppointmentsStore);
    }
  }
  
}