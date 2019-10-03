import { Model } from '../lib';

import {
  observable,
  action,
  computed,
  toJS
} from 'mobx'

export default class User extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }

  @computed
  get userRole() {
    return this.roles[0].name;
  }
}