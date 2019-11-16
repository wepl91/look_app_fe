import { Store } from '../lib';
import { Branch } from '../models'; 

export default class BranchesStore extends Store {
  urlRoot = '/branches';
  model = Branch;

  constructor(adapter, appStore) {
    super(adapter, appStore);
      this.adapter = adapter;
      this.appStore = appStore;
  }
}