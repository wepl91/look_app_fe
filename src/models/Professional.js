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
      services: '',
      workingHours: ''
      // branch: ''
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

  @computed
  get professionalServicesIds() {
    const ret = [];
    this.services.map( service => (ret.push(service.id)))
    return ret;
  }

/*   @computed
  get workingHours() {
    const ret = [];
    this.workingHours.map( day => (ret.push(`${ day.days.name } ${ day.beginHour } ${ day.endHour }`)))
    return ret;
  } */
}