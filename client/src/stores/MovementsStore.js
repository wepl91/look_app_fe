import { Store } from '../lib';
import { Movement } from '../models'; 
import { action } from 'mobx';

import Colection from '../lib/Collection';

export default class MovementsStore extends Store {
  urlRoot = '/movement';
  model = Movement;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}