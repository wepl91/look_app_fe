import { Model } from '../lib';
import {
  action,
  computed,
} from 'mobx'

import moment from 'moment';

import startCase from 'lodash/startCase';

export default class Discount extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      name: '',
      status: '',
      type: '',
      discount: 0,
      startDate: '',
      endDate: '',
      services: []
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }

  @computed
  get isActive() {
    return this.status == 'ACTIVE';
  }

  @computed
  get cookedStartingDate(){
    return moment(this.startDate).format('DD/MM/YYYY')
  }

  @computed
  get cookedEndingDate(){
    return moment(this.endDate).format('DD/MM/YYYY')
  }

  @computed
  get rawStartingDate(){
    if(this.startDate != ''){
      return moment(this.startDate)
    }
    return null
  }

  @computed
  get rawEndingDate(){
    if(this.endDate != ''){
      return moment(this.endDate)
    }
    return null
  }

  @computed
  get discountServicesIds() {
    const ret = [];
    this.services.map( service => (ret.push(service.id)))
    return ret;
  }

  @computed
  get discountedServices() {
    const ret = [];
    this.services.map( service => (ret.push(startCase(service.name))))
    return ret;
  }

  @action
  activate() {
    this.status = 'ACTIVE';
    return this.clean().save();
  }

  @action
  deactivate() {
    this.status = 'INACTIVE';
    return this.clean().save();
  }

  @action
  clean() {
    const cleanServices = [];
    this.services.forEach( service => {
      if (service instanceof Object) {
        cleanServices.push(service.id);
      }
      else {
        cleanServices.push(service);
      }
    });
    this.services = cleanServices;
    return this;
  }
}