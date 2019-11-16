import { Model } from '../lib';

import {
  computed,
  action
} from 'mobx'

import startCase from 'lodash/startCase';
import moment from 'moment';


import { Service, Branch } from '../models';
import { ServicesStore, BranchesStore } from '../stores';

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

  afterSetData() {
    if (this.services) {
      const modeledServices = [];
      this.services.forEach( service => {
        modeledServices.push(new Service(service, ServicesStore));
      });
      this.services = modeledServices;
    }
    if (this.branch) {
      this.branch = new Branch(this.branch, BranchesStore);
    }
  }

  @computed
  get fullName() {
    return `${ startCase(this.name) || '' } ${ startCase(this.lastName) || '' }`;
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
  get cookedBranchId() {
    return this.branch instanceof Object ? this.branch.id : this.branch;
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

  @action
  filteredWorkingHours( receivedDay ) {
    let ret = []
    let currDate = null
    let lastDate = null

    this.workingHours.map(day => {
      if(day.days.name == receivedDay.toUpperCase()){
        currDate = moment(day.beginHour.toString(),"LT").startOf('minute').subtract(60, 'minutes');
        lastDate = moment(day.endHour.toString(),"LT").startOf('minute').add(60, 'minutes');
      }
    })

    if(!currDate || !lastDate){
      return null
    }
    while (currDate.add(60, 'minutes').diff(lastDate, 'minutes') < 0) {
      ret.push(currDate.clone().format('HH:mm'));
    }
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

    if (this.branch instanceof Object) {
      this.branch = this.branch.id;
    }
    return this;
  }
}