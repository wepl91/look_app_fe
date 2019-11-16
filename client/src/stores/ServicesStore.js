import { Store } from '../lib';
import { Service } from '../models'; 

export default class ServicesStore extends Store {
  urlRoot = '/services';
  model = Service;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}