import { Store } from '../lib';
import { Professional } from '../models'; 

export default class ProfessionalsStore extends Store {
  urlRoot = '/professionals';
  model = Professional;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}