import { Store } from '../lib';
import { Role } from '../models'; 

export default class RolesStore extends Store {
  urlRoot = '/roles';
  model = Role;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}