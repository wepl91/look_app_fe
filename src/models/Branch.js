import { Model } from '../lib';
import {
  action,
  computed,
} from 'mobx'

import startCase from 'lodash/startCase';
import uniq from 'lodash/uniq'

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

  @computed
  get cookedAddress() {
    return `${ startCase(this.street_name) } ${ this.street_number }, ${ startCase(this.location) }`
  }

  @computed
  get allServices() {
    const services = [];
    this.professionals.forEach( professional => {
      professional.services.forEach( service => {
        if (!services.includes(service)) {
          services.push(new Service(service, ServicesStore));
        }
      });
    });
    return Object.values(services.reduce((acc,cur) => Object.assign(acc,{[cur.id]:cur}),{}));
  }
}