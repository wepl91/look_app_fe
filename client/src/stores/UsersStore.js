import { Store } from '../lib';
import { User } from '../models'; 

export default class UsersStore extends Store {
  urlRoot = '/users';
  model = User;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}