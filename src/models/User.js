import { Model } from '../lib';

import {
  action,
  computed,
} from 'mobx'

import startCase from 'lodash/startCase';

import { Branch } from '../models';
import { BranchesStore } from '../stores';
export default class User extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      username: '',
      fullName: '',
      email: '',
      roles: [],
      name: '',
      lastName: '',
      status: null,
      branch: {},
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }
  afterSetData() {
    if (this.branch) {
      this.branch = new Branch(this.branch, BranchesStore);
    }
  }

  @computed
  get cookedName() {
    return startCase(this.name);
  }

  @computed
  get cookedLastName() {
    return startCase(this.lastName);
  }

  @computed
  get cookedFullName() {
    if (!this.name && !this.lastName) {
      return null;
    }
    return `${ startCase(this.name) || '' } ${ startCase(this.lastName) || '' }`;
  }

  @computed
  get userRole() {
    return this.roles[0] && this.roles[0].name;
  }

  @computed
  get roleID() {
    return (this.roles[0] && this.roles[0].id) || this.roles[0];
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

  @action
  clean() {
    if (this.branch instanceof Object) {
      this.branch = this.branch.id;
    }
    if (this.status instanceof Object) {
      this.status = this.status.name;
    }
    const cleanRoles = [];
    this.roles.forEach( rol => {
      if (rol instanceof Object) {
        cleanRoles.push(rol.id);
      }
    });

    return this;
  }
}