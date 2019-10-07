import { Model } from '../lib';

import {
  observable,
  action,
  computed,
  toJS
} from 'mobx'

import startCase from 'lodash/startCase';

export default class Professional extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      name: '',
      lastName: '',
      phone: '',
      email: '',
      status: '',
/*       branch: '',
      workingHours: '', 
      services: ''*/
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }

  @computed
  get fullName() {
    return `${ this.name || '' } ${ this.lastName || '' }`;
  }

  @computed
  get professionalStatus() {
    return this.status.name;
  }

  @computed
  get professionalServices() {
    const ret = [];
    this.services.map( service => (ret.push(startCase(service.name))))
    return ret;
  }
}