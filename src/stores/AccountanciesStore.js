import { Store } from '../lib';
import { Accountancy } from '../models'; 
import { action } from 'mobx';

import Colection from '../lib/Collection';

export default class AccountanciesStore extends Store {
  urlRoot = '/accountancy';
  model = Accountancy;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }

  @action
  get( id ) {
    let collection = new Colection(this, `accountancy-client-${id}`);
    this.adapter.get(`/accoutancy/${id}`).then( response => {
      response.results.forEach( (res, index) => {
        res['id'] = index;
        collection.add(new Accountancy(res, this));
      });
    });
  }
}