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
  get cookedBranchId() {
    return this.branch instanceof Object ? this.branch.id : this.branch;
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

  @computed
  get cookedRole() {
    return this.roles[0].name || this.role;
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

  @computed
  get rolLevel() {
    let role = this.cookedRole || '';
    role = role.toLowerCase();
    const levels = {
      'recepcionista': 1,
      'contador': 2,
      'supervisor': 3,
      'administrador': 4,
    }

    return levels[role];
  }

  canSeeAppointments() {
    return this.rolLevel >= 1;
  }

  canEditAppointment() {
    return this.rolLevel >= 1;
  }

  canSeeBranches() {
    return this.rolLevel >= 3
  }

  canEditBranches() {
    return this.rolLevel >= 3
  }

  canSeeServices() {
    return this.rolLevel >= 3
  }

  canEditServices() {
    return this.rolLevel >= 3;
  }

  canSeeProffesionals() {
    return this.rolLevel >= 3;
  }

  canEditProfessional() {
    return this.rolLevel >= 3;
  }

  canSeeUsers() {
    return this.rolLevel >= 3;
  }

  canEditUsers() {
    return this.rolLevel == 4;
  }

  canSeeClients() {
    return this.rolLevel >= 1;
  }

  canEditClients() {
    return this.rolLevel >= 1;
  }

  canSeePromotions() {
    return this.rolLevel >= 2;
  }

  canEditPromotions() {
    return this.rolLevel >= 2;
  }

  canSeeReports() {
    return this.rolLevel >= 3;
  }

  canSeeDBConfig() {
    return this.rolLevel == 4;
  }
  
  canSeePointsConfig() {
    return this.rolLevel >= 2;
  }
}