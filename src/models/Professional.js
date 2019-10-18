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

  @computed
  get cookedWorkingDays() {
    const ret = [];
    const cookedDays = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    }
    const sorter = {
      "lunes": 1,
      "martes": 2,
      "miércoles": 3,
      "jueves": 4,
      "viernes": 5,
      "sábado": 6,
      "domingo": 7
    }
    this.workingHours.map( day => (ret.push(cookedDays[day.days.name])))
    ret.sort(function sortByDay(a, b) {
      let day1 = a.toLowerCase();
      let day2 = b.toLowerCase();
      return sorter[day1] - sorter[day2];
    });
    return ret;
  }

  @computed
  get cookedWorkingHours() {
    //Consultar con Walter, no logré hacer this.workingHours[0]
    let ret = []
    this.workingHours.map( day => (ret.push(` ${ day.beginHour } a ${ day.endHour }`)))
    return ret[0]
  }
}