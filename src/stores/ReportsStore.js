import { Store } from '../lib';
import { Reports } from '../models'; 
import {
  action,
  computed,
} from 'mobx';

import Colection from '../lib/Collection';

export default class ReportsStore extends Store {
  urlRoot = '/reports';
  model = Reports;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }

  @action
  getProfessionalsReport(params) {
    let collection = new Colection(this, `professional-reports-${params}`);
    this.adapter.post('/professionalsreports',params).then( response => {
      response.results.forEach( (res, index) => {
        res['id'] = index;
        collection.add(new Reports(res, this));
      });
    });
    collection._status = 'ok';
    return collection;
  }
  
  @action
  getServicesReport(params) {
    let collection = new Colection(this, `professional-reports-${params}`);
    this.adapter.post('/servicesreports',params).then( response => {
      response.results.forEach( (res, index) => {
        res['id'] = index;
        collection.add(new Reports(res, this));
      });
    });
    collection._status = 'ok';
    return collection;
  }
}