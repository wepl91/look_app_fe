import { Store } from '../lib';
import { Appointment } from '../models'; 

export default class AppointmentsStore extends Store {
  urlRoot = '/turns';
  model = Appointment;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}