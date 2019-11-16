import { Model } from '../lib';
import {
  action,
  computed,
} from 'mobx'

import startCase from 'lodash/startCase';
import uniq from 'lodash/uniq'
import moment from 'moment';
import { Service, User, Professional } from '../models';
import { ServicesStore, UsersStore, ProfessionalsStore } from '../stores';

export default class Branch extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      'location': '',
      'street_number': '',
      'street_name': '',
      'name': '',
      'status': 'ACTIVE',
      'professionals': [],
      'users': [],
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }

  afterSetData() {
    if (this.professionals) {
      const modeledProfessionals = [];
      this.professionals.forEach( professional => {
        modeledProfessionals.push(new Professional(professional, ProfessionalsStore))
      });
      this.professionals = modeledProfessionals;
    }
    if (this.users) {
      const modeledUsers = [];
      this.users.forEach( user => {
        modeledUsers.push(new User(user, UsersStore));
      });
      this.users = modeledUsers;
    }
  }

  @computed
  get cookedStatus() {
    const statuses = {
      'ACTIVE': 'Activo',
      'INACTIVE': 'Inactivo'
    }
    return statuses[this.status.name || this.status];
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
  filterProfessionals( day ) {
    let ret = []
    this.professionals.map(professional => {
      if(day.toUpperCase() in professional.rawWorkingDays){
        ret.push(professional)
      } 
    })
    return ret
  }

  @action
  openHours( day ) {
    let ret = []
    let earliest = []
    let latest = []
    this.professionals.map(professional => {
      if(day.toUpperCase() in professional.rawWorkingDays){
        let hours = professional.filteredWorkingHours(day)
        earliest.push(hours[0])
        latest.push(hours[hours.length -1])
      } 
    })
    let earliestMoments = earliest.map( d => moment(d.toString(),"LT"))
    let latestMoments = latest.map( d => moment(d.toString(),"LT"))

    let currDate = moment.min(earliestMoments).startOf('minute').subtract(60, 'minutes');
    let lastDate = moment.max(latestMoments).startOf('minute').add(60, 'minutes');

    while (currDate.add(60, 'minutes').diff(lastDate, 'minutes') < 0) {
      ret.push(currDate.clone().format('HH:mm'));
    }

    if(ret.length == 1){
      return null
    }
    return ret
  }

  @computed
  get isActive() {
    return this.status.name == 'ACTIVE' || this.status == 'ACTIVE';
  }

  @computed
  get cookedAddress() {
    return `${ startCase(this.street_name) } ${ this.street_number }, ${ startCase(this.location) }`
  }

  @computed
  get allServices() {
    const services = [];
    this.professionals.forEach( professional => {
      if (professional.isActive) {
        professional.services.forEach( service => {
          if (!services.includes(service)) {
            services.push(new Service(service, ServicesStore));
          }
        });
      }
    });
    return Object.values(services.reduce((acc,cur) => Object.assign(acc,{[cur.id]:cur}),{}));
  }

  @action
  clean() {
    const cleanedProfessional = [];
    const cleanedUsers = [];
    this.professionals.forEach( professional => {
      if (professional instanceof Object) {
        cleanedProfessional.push({id: professional.id});
      }
      else {
        cleanedProfessional.push({id: professional});
      }
    });
    this.users.forEach( user => {
      if (user instanceof Object) {
        cleanedUsers.push({id: user.id});
      }
      else {
        cleanedUsers.push({id: user});
      }
    });
    this.professionals = cleanedProfessional;
    this.users = cleanedUsers;

    return this;
  }
}