import { Store } from '../lib';
import { Accountancy, Movement } from '../models'; 
import { ModementsStore, MovementsStore } from '../stores';
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
  async get( id ) {
    let data = {};
    let movements = [];
    await this.adapter.get(`/accountancy/${id}`).then( response => {
      response.results.accountMovements.forEach( movement => {
        movements.push(new Movement(movement, MovementsStore));
      });
    });
    data['movements'] = movements;

    return new Accountancy(data, this);
  }
}