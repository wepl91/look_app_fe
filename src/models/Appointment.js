import { Model } from '../lib';

import {
  action,
  computed,
} from 'mobx'

import moment from 'moment';
import startCase from 'lodash/startCase';

import { Service, User, Professional, Client, Branch } from '../models';
import { ServicesStore, UsersStore, ProfessionalsStore, ClientsStore, BranchesStore } from '../stores';

export default class Appointment extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      local: '',
      branch: null,
      status: "OPEN",
      professional: null,
      client: null,
      dayHour: moment(),
      services: [], 
    };
    
    let attrs = Object.assign( defaultAttributes, attributes );
    
    super(attrs, store);
    
  }
  
  afterSetData() {
    if (this.dayHour) {
      this.dayHour = moment(this.dayHour);
    }
    if (this.client) {
      this.client = new Client(this.client, ClientsStore);
    }
    if (this.professional) {
      this.professional = new Professional(this.professional, ProfessionalsStore);
    }
    if (this.users) {
      this.user = new User(this.user, UsersStore);
    }
    if (this.services) {
      const modeledServices = [];
      this.services.forEach( service => {
        modeledServices.push(new Service(service, ServicesStore));
      });
      this.services = modeledServices;
    }
    if (this.branch) {
      this.appStore.stores.get('branches').get(this.branch.id).andThen( branch => {
        this.branch = branch;
      })
    }
  }

  @action
  setStatus( status ) {
    this.beginUpdate();
    this.status.name = status;
    this.endUpdate();
    return this;  
  }

  @computed
  get clientFullName() {
    if (!this.client) {
      return '';
    }
    return `${ startCase(this.client.name) } ${ startCase(this.client.lastname) }`
  }

  @computed
  get clientPoints() {
    if (!this.client) {
      return '';
    }
    return this.client.points
  }

  @computed
  get professionalFullName() {
    if (!this.professional) {
      return '';
    }
    return `${ startCase(this.professional.name) } ${ startCase(this.professional.lastName) }`;
  }

  @computed
  get clientID() {
    if (!this.client) {
      return '';
    }
    return this.client.id
  }

  @computed
  get totalPrice() {
    let total = 0;
    if (!this.services || this.services.length == 0) {
      return 0;
    }

    this.services.map( service => ( total += parseInt(service.price) ));
    return total;
  }

  @computed
  get isOpen() {
    return this.status.name === 'OPEN';
  }

  @computed
  get isPaid() {
    return this.status.name === 'PAID';
  }

  @computed
  get isCancelled() {
    return this.status.name === 'CANCELED';
  }

  @computed
  get isExpired() {
    return this.status.name === 'EXPIRED';
  }

  @computed
  get statusClassName() {
    const classNames = {
      'OPEN': 'open',
      'PAID': 'approved',
      'CANCELED': 'cancelled',
      'EXPIRED': 'cancelled'
    }
    return classNames[this.status.name];
  }

  @action
  pay() {
    return this.appStore.APIClient.sendRequest(`/appointments/${ this.id }/paid`, 'POST')
  }

  @action
  cancel() {
    return this.appStore.APIClient.sendRequest(`/appointments/${ this.id }/cancel`, 'POST');
  }

  @action
  pay() {
    return this.appStore.APIClient.sendRequest(`/appointments/${ this.id }/paid`, 'POST')
  }

  @action 
  clean() {
    if (this.client instanceof Object) {
      this.client = this.client.id
    }
    if (this.professional instanceof Object) {
      this.professional = this.professional.id;
    }
    const cleanServices = [];
    this.services.forEach( service => {
      if (service instanceof Object) {
        cleanServices.push(service.id)
      }
      else {
        cleanServices.push(service)
      }
    });
    this.services = cleanServices;
    return this;
  }

  @computed
  get cookedStatus() {
    const statuses = {
      'OPEN': 'Activo',
      'PAID': 'Pagado',
      'CANCELED': 'Cancelado',
      'EXPIRED': 'Ausente'
    }
    return statuses[this.status.name];
  }

  @computed
  get beginningTime() {
    return this.dayHour.format("HH:mm")
  }

  @computed
  get finishTime() {
    let totalDuration = 0;
    this.services.map( service => (totalDuration += service.duration));

    return moment(this.dayHour).add(totalDuration, 'minutes').format("HH:mm");
  }

  @computed
  get servicesIds() {
    const ret = [];
    this.services.map( service => (ret.push(service.id)))
    return ret;
  }

}