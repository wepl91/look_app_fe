import { Store } from '../lib';
import { Configs } from '../models'; 

export default class ConfigsStore extends Store {
  urlRoot = '/configs';
  model = Configs;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}