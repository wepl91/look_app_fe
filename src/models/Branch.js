import { Model } from '../lib';
import {
  action,
  computed,
} from 'mobx'

import startCase from 'lodash/startCase';

export default class Branch extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      'location': '',
      'street_number': '',
      'street_name': '',
      'name': '',
      'status': 'ACTIVE'
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }

  @computed
  get cookedStatus() {
    const statuses = {
      'ACTIVE': 'Activo',
      'INACTIVE': 'Inactivo'
    }
    return statuses[this.status.name || this.status];
  }

  @computed
  get cookedAddress() {
    return `${ startCase(this.street_name) } ${ this.street_number }, ${ startCase(this.location) }`
  }
}