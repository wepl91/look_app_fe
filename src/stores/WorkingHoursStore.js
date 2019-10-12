import { Store } from '../lib';
import { WorkingHours } from '../models'; 

export default class WorkingHoursStore extends Store {
  urlRoot = '/workingHours';
  model = WorkingHours;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}