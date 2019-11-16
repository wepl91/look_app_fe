import { Model } from '../lib';

import {
  action,
  computed,
} from 'mobx'

import moment from 'moment';
import startCase from 'lodash/startCase';

import { Service, User, Professional, Client, Branch } from '../models';
import { ServicesStore, UsersStore, ProfessionalsStore, ClientsStore, BranchesStore } from '../stores';

import MiddleClient from '../lib/MiddleClient';

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
      this.branch = new Branch(this.branch, BranchesStore);
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
    return parseFloat(total);
  }

  @computed
  get isOpen() {
    return this.status.name === 'OPEN';
  }

  @computed
  get isPartialPaid() {
    return this.status.name == 'PARTIAL_PAID' || this.status.name == 'PENDING_PAID'
  }

  @computed
  get isTrustworthy() {
    return this.status.name == 'PENDING_PAID';
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
      'EXPIRED': 'cancelled',
      'PARTIAL_PAID': 'warning',
      'PENDING_PAID': 'warning',
    }
    return classNames[this.status.name];
  }

  @action
  pay(money = null, points = null) {
    let params = {};
    if (money) {
      params['amount'] = parseInt(money,10);
    }
    else {
      params['amount'] = 0;
    }
    if (points) {
      params['points'] = parseInt(points,10);
    }
    params['appointmentId'] = parseInt(this.id,10);
    params['clientId'] = parseInt(this.clientID,10);
    params['currency'] = 'ARS';
    debugger
    return this.appStore.APIClient.sendRequest(`/appointments/${ this.id }/pay`, 'POST', params);
  }

  @action
  loan() {
    return this.appStore.APIClient.sendRequest(`/appointments/${ this.id }/pending`, 'POST');
  }

  @action
  cancel() {
    return this.appStore.APIClient.sendRequest(`/appointments/${ this.id }/cancel`, 'POST');
  }

  @action 
  clean() {
    if (this.client instanceof Object) {
      this.client = this.client.id
    }
    if (this.branch instanceof Object) {
      this.branch = this.branch.id
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
      'EXPIRED': 'Ausente',
      'PARTIAL_PAID': 'Pagado parcialmente',
      'PENDING_PAID': 'Pago pendiente'
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
  get finishHour() {
    let totalDuration = 0;
    this.services.map( service => (totalDuration += service.duration));

    return moment(this.dayHour).add(totalDuration, 'minutes');
  }

  @computed
  get servicesIds() {
    const ret = [];
    this.services.map( service => (ret.push(service.id)))
    return ret;
  }

  @computed
  get servicesNames() {
    const ret = [];
    this.services.forEach( service => {
      ret.push(startCase(service.name));
    });
    return ret;
  }

  @action
  sendInvite() {
    debugger
    //If there is no client or client has no email or email client is not gmail domain, we do not send invite
    if (!this.client || !this.client.email || !this.client.email.includes('gmail.com')) {
      return;
    }
    debugger
    const middleClient = new MiddleClient();
    const data = {};
    data['location'] = this.branch.cookedAddress;
    data['participants'] = [{email: this.client.email}];
    data['description'] = `Los servicios que se realizarán son: ${ this.servicesNames }`;
    data['to_hour'] = moment(this.finishHour).unix();
    data['from_hour'] = moment(this.dayHour).unix();

    return middleClient.sendInvite(data);
  }
}