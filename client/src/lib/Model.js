import {
  observable,
  action,
  computed,
  toJS
} from 'mobx'

import moment from 'moment';

export default class Model {

  @observable attributes = new Map();

  _uriBase = '';
  _primaryKey = 'id';
  _store = null;
  _error = null;
  _onUpdateCallback;

  abilities = {};

  @observable _lastUpdateAt;
  @observable _status; // empty | first-load | busy | ok | error

  constructor ( attributes, store ) {
    this._store = store;
    this._status = 'empty';
    this.set(attributes);
  }

  /**
   * Model shallow serialization 
   *
   */
  toJS () {
    return toJS(this.attributes);
  }

  /**
   * Returns a dettached copy from the store collection
   *
   */
  clone () {

    let ModelClass = this._store.model;
    let clone = new ModelClass(this.toJS(),  this._store);

    clone._status = this._status;

    return clone;    
  }

  /**
   * Model serialization for REST operations 
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

  canBe(action) {
    let loggedInUser = null;

    if ( this._store.appStore ) {
      loggedInUser = this._store.appStore.loggedInUser;
    }
    
    if ( this.abilities.hasOwnProperty(action) ) {
      return this.abilities[action](loggedInUser);
    }

    return true;
  }


  @computed
  get modelURI () {
    if (this.isNew) {
      return this._uriBase;
    } 
    else {
      return `${this._uriBase}/${this.get(this._primaryKey)}`;
    }
  }

  has (attribute) {
    return this.attributes.has(attribute)
  }  

  @computed
  get isNew () {
    return !this.has(this._primaryKey)
  }


  get (attribute) {
    if (this.attributes.has(attribute)) {
      return this.attributes.get(attribute);
    }
    
    return null;
  }  


  get id () {
    return this.has(this._primaryKey)
      ? this.get(this._primaryKey)
      : null;
  }

  get appStore() {
    return this._store.appStore;
  }

  @action
  beginUpdate() {
    this._status = this._status === 'empty' ? 'first-load' : 'busy';
  }

  @action
  endUpdate(error) {
    if ( error ) {
      
      try {
        this._error  = error.message ? JSON.parse(error.message)['errors'] : error;
        this._status = 'error';
      } 
      catch (err) {
        this._error = error
        this._status = 'error';
      }
      this._status = 'error'; 
      this.modelDidUpdate();
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
    if(data !== undefined && data.attributes !== undefined){
      return data.attributes;
    }
    return data;
  }

  @action
  afterSetData() {}

  @action
  set (data) {

    this.attributes.merge(this.transformData(data));

    this.attributes.forEach( (value, key) => { if( this[key] === undefined ) Object.defineProperty(this, key, { 
        set: (v) => this.attributes.set(key, v),
        get: (v) => this.get(key),
      })} );

    this.afterSetData();

    this._lastUpdateAt = moment();
  }

  @action 
  setField (field, data) {
    this.attributes.set( field, data );

    this._lastUpdateAt = moment();

    Object.defineProperty(this, field, { 
        set: (v) => this.attributes.set(field, v),
        get: (v) => this.get(field),
      });
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

  save() {
    return this._store.save(this);
  }

  delete() {
    return this._store.destroy(this);
  }

}
