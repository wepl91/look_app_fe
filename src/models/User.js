import { Model } from '../lib';

import {
  action,
  computed,
} from 'mobx'

export default class User extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      username: '',
      fullName: '',
      email: '',
      roles: [],
      name: '',
      lastname: '',
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }

  @computed
  get cookedName() {
    return (this.fullName && this.fullName.split(" ")[0]) || this.name;
  }

  @computed
  get cookedLastname() {
    return (this.fullName && this.fullName.split(" ")[1]) || this.lastname;
  }

  @computed
  get userRole() {
    return this.roles[0] && this.roles[0].name;
  }

  @computed
  get roleID() {
    return (this.roles[0] && this.roles[0].id) || this.roles[0];
  }
}