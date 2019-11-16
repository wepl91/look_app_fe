import {
  observable,
  action,
  computed,
  toJS
} from 'mobx'

import moment from 'moment';

export default class DataWrapper {

  @observable attributes = new Map();
  @observable items = new Array();

  // _uriBase = '';
  // _primaryKey = 'id';
  _store = null;
  _error = null;
  _onUpdateCallback;

  _type = 'object'; // object | array

  @observable _lastUpdateAt;
  @observable _status; // empty | first-load | busy | ok | error

  constructor ( data, store ) {
    this._store = store;
    this._status = 'empty';

    this.set(data);
  }

  /**
   * DataWrapper shallow serialization 
   *
   */
  toJS () {
    return toJS(this._type == 'object' ? this.attributes : this.items);
  }

  /**
   * DataWrapper serialization for REST operations 
   *
   */
  toParams () {
    return this.toJS();
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

  get (attribute) {
    if (this.attributes.has(attribute)) {
      return this.attributes.get(attribute);
    }
    
    return null;
  }  

  @action
  beginUpdate() {
    this._status = this._status === 'empty' ? 'first-load' : 'busy';
  }


  @action
  endUpdate(error) {
    if ( error ) {
      this._error  = error;
      this._status = 'error'; 
    }
    else {
      this._status = 'ok';
      this.modelDidUpdate();      

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


  transformData(data) {
    return data;
  }


  @action
  set (data) {

    this._lastUpdateAt = moment();

    this._type = Array.isArray(data) ? 'array' : 'object';
    
    if ( this._type == 'object' ) {

      this.attributes.merge(this.transformData(data));

      this.attributes.forEach( (value, key) => { if( this[key] === undefined ) Object.defineProperty(this, key, { 
          set: (v) => this.attributes.set(key, v),
          get: (v) => this.get(key),
        })} );


      this.items.clear();

    }
    else {
      this.items.replace(this.transformData(data));
      this.attributes.clear();
    }

  }


  modelDidUpdate() {}


  andThen( _callback ) {

    if ( this.isOk() ) {
      _callback && _callback(this);
      return this;
    }

    this._onUpdateCallback = _callback;

    return this;
  }  


}
