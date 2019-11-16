import { Store } from '../lib';
import { Client } from '../models'; 

export default class ClientsStore extends Store {
  urlRoot = '/clients';
  model = Client;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}