import { Model } from '../lib';

import {
  computed,
} from 'mobx'

import moment from 'moment';

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

}