import { Model } from '../lib';
import {
  action,
  computed,
} from 'mobx'

import startCase from 'lodash/startCase';

export default class Client extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      name: '',
      DNI: '',
      primaryPhone: 0,
      status: 'NORMAL',
      secondPhone: 0,
      lastName: '',
      email: '',
      points: ''
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }

  @computed
  get category() {
    const status = {
      'VIP': 'VIP',
      'NORMAL': 'Normal',
      'MOROSO': 'Moroso'
    };

    return status[this.status.name] || this.status;
  }

  @computed
  get fullName() {
    return `${ startCase(this.name) } ${ startCase(this.lastName) }`
  }

  @computed
  get cookedPhone() {
    return this.primaryPhone || this.secondPhone;
  }
}