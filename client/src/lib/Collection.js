
import { observable, action, computed, ObservableMap, toJS } from 'mobx';
import Model from './Model';

import moment from 'moment';

export default class Collection {
  @observable items = new Map();
  @observable _lastUpdateAt;
  @observable _status; // empty | first-load | busy | ok | error

  _store;
  _error;
  _onUpdateCallback;

  onCollectionUpdate;

  view;

  constructor (store, view) {
    this._lastUpdateAt = moment('1900-01-01');
    this._status = 'empty';

    this._store = store;

    this.view = view;
  }

  /**
   * Returns a JSON representation
   * of the collection
   */
  toJS () {
    return toJS(this.items);
  }

  /**
   * Returns a shallow array representation
   * of the collection
   */
  toArray () {
    let arr = [];

    this.items.forEach( i => arr.push(i) );

    return arr;
  }

  get length() {
    return this.items.size;
  }

  isEmpty() {
    return this._status == 'empty' || this._status == 'first-load';
  }

  isBusy() {
    return this._status == 'busy' || this._status == 'first-load';
  }

  isOk() {
    return this._status == 'ok';
  }

  isError() {
    return this._status == 'error';
  }


  @action
  clear() {
    this.items.clear();
  }

  find ( id ) {
    return this.items.get(id.toString());
  }


  @action
  beginUpdate() {
    this._status = this._status == 'empty' ? 'first-load' : 'busy';
  }

  @action
  endUpdate(error) {
    if ( error ) {
      this._error  = error;
      this._status = 'error'; 
    }
    else {
      this._status = 'ok';
      this.collectionDidUpdate();
    }

    if ( this._onUpdateCallback ) {
      this._onUpdateCallback(this, error);
      this._onUpdateCallback = null;
    }

    this._lastUpdateAt = moment();
  }

  needsUpdate() {
    if ( this._status == 'busy' ) return false;

    return this._status == 'empty' || moment().diff( this._lastUpdateAt, 'minutes' ) > this._store.updateThreshold; // this should be parametrized
  }

  @action
  addOrUpdateModel(model) {

    if ( this.items.has(model.id.toString()) ) {
      let storedModel = this.items.get(model.id.toString());

      //update stored model
      storedModel.set( model.attributes );
      storedModel.endUpdate();

      return storedModel;
    }
    else {

      this.add(model);
      model.endUpdate();

      return model;
    }
  }

  collectionDidUpdate() {
    this.onCollectionUpdate && this.onCollectionUpdate();
  }  


  andThen( _callback ) {

    if ( this.isOk() ) {
      _callback && _callback(this);
      return this;
    }

    this._onUpdateCallback = _callback;

    return this;
  }

  @action
  add(model) {
    this.items.set( model.id.toString(), model );
  }


  @action
  clear() {
    this.items.clear();
  }



  getContextData() {
    let result = this._store.viewData(this.view).toJSON();

    return {
      page: Number(result['x-page']),
      total: Number(result['x-total']),
      perPage: Number(result['x-per-page']),
    };
  }

  get currentPage() {
    return this.getContextData().page;
  }

  get totalRows() {
    return this.getContextData().total;
  }

  get perPageRows() {
    return this.getContextData().perPage;
  }

  get totalPages() {
    const cd = this.getContextData();
    return Math.ceil(cd.total / cd.perPage);
  }

  get hasNextPage() {
    return this.currentPage < this.totalPages;
  }


}
