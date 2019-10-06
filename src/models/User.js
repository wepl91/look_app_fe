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
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }

  @computed
  get userRole() {
    return this.roles[0].name;
  }
}