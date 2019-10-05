import { Model } from '../lib';

import {
  observable,
  action,
  computed,
  toJS
} from 'mobx'

export default class Professional extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      name: '',
      lastName: '',
      phone: '',
      email: '',
/*       branch: '',
      workingHours: '', */
      services: ''
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }

  @computed
  get fullName() {
    return this.name + " " + this.lastName;
  }

  @computed
  get professionalStatus() {
    return this.status.name;
  }

  @computed
  get professionalServices() {
    return this.services[0].name;
  }
}