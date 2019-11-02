import { Model } from '../lib';

import {
  computed,
  action
} from 'mobx'

import startCase from 'lodash/startCase';
import moment from 'moment';

export default class Professional extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      name: '',
      lastName: '',
      phone: '',
      email: '',
      status: '',
      services: '',
      workingHours: '',
      branch: 1,
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
  get rawWorkingDays() {
    let ret = {}
    this.workingHours.map( day => {
      ret[day.days.name] = {}
      ret[day.days.name]['sta'] = moment(day.beginHour.toString(),"LT").format("HH:mm")
      ret[day.days.name]['fin'] = moment(day.endHour.toString(),"LT").format("HH:mm")
    })
    return ret
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
    }
    const sorter = {
      "lunes": 1,
      "martes": 2,
      "miércoles": 3,
      "jueves": 4,
      "viernes": 5,
      "sábado": 6,
    }
    this.workingHours.map( day => (ret.push({day: cookedDays[day.days.name], begin: moment(day.beginHour.toString(),"LT").format("HH:mm"), end: moment(day.endHour.toString(),"LT").format("HH:mm")})))
    ret.sort(function sortByDay(a, b) {
      let day1 = a.day.toLowerCase();
      let day2 = b.day.toLowerCase();
      return sorter[day1] - sorter[day2];
    });
    return ret;
  }

  @computed
  get isActive() {
    return this.status.name == 'ACTIVE';
  }

  @action
  activate() {
    this.status = 'ACTIVE';
    return this.save();
  }

  @action
  deactivate() {
    this.status = 'INACTIVE';
    return this.save();
  }
}