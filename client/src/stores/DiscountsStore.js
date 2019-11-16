import { Store } from '../lib';
import { Discount } from '../models'; 

export default class DiscountsStore extends Store {
  urlRoot = '/promotions';
  model = Discount;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}