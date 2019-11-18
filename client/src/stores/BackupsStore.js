import { Store } from '../lib';
import { Backup } from '../models'; 
import { action } from 'mobx';
import Colection from '../lib/Collection';

export default class BranchesStore extends Store {
  urlRoot = '/backup';
  model = Backup;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }

  @action
  getBackup() {
    let collection = new Colection(this, `backups`);
    this.adapter.search('/backup', {}, false, false).then( response => {
      response.results['id'] = 1;
      collection.add(new Backup(response.results, this));
    });
    collection._status = 'ok';
    return collection;
  }

  @action
  sendImport(data) {
    return this.adapter.sendRequest('/backup', 'POST', data, false);
  }
}