import {
  observable,
  action,
  computed,
  toJS
} from 'mobx';

import { Model, Collection, DataWrapper } from './';

import { hashCode } from './Helper';

export default class Store {
  @observable items = new Collection(this); // all items in the store
  @observable views = new Map(); // views contain Collections of items according to UI needs
  @observable contextData = new Map(); // contextData contextual information accoording to UI needs
  @observable fetchResults = new Map(); // stores model-unrelated results; stores DataWrappers
  

  model = null;
  appStore = null;
  sufix = null;
  adapter = null;
  urlRoot = null;

  updateThreshold = 2; // minutes -- make this 5 

  constructor (adapter, appStore) {
    this.adapter = adapter;
    this.appStore = appStore;

    if ( appStore && appStore.settings && appStore.settings.refreshRate ) {
      this.updateThreshold = this.appStore.settings.refreshRate;
    }
  }

  get modelRoot() {
    if ( this.urlRoot ) return this.urlRoot;
    
    const ModelClass = this.model;
    this.urlRoot = (new ModelClass({}, this)).urlRoot;

    return this.urlRoot;
  }

  view( viewName ) {
    let view;

    if ( !this.views.has(viewName) ) {
      view = new Collection(this, viewName);
      this.views.set( viewName, view );
    }
    else {
      view = this.views.get(viewName);
    }

    return view;
  }

  viewData( viewName ) {
    let viewData;

    if( !this.contextData.has( viewName ) ) {
      viewData = observable(new Map());
      this.contextData.set( viewName, viewData )
    }
    else {
      viewData = this.contextData.get( viewName );
    }
    return viewData;
  }

  fetchResult( viewName, defaultData ) {
    let view;

    if ( !this.fetchResults.has(viewName) ) {
      view = new DataWrapper(defaultData, this);
      this.fetchResults.set(viewName, view);
    }
    else {
      view = this.fetchResults.get(viewName);
    }

    return view;
  }

  getDummy( length = 1 ) {
    const ModelClass = this.model;
    if ( length <= 1 ) {
      return new ModelClass({}, this);
    }
    else {
      return Array.from( Array(length) ).map( () => ( new ModelClass({}, this)) );
    }
  }

  getNew( attrs = {} ) {
    const ModelClass = this.model;
    return new ModelClass(attrs, this);
  }

  @action
  getAll( limit = 1000 ) {
    return this.search({ per_page: limit }, 'all', true);
  }

  @action
  search( filters, viewName = 'default', forceRefresh = false /*, returnPromise = false */, apiPath = null ) {

    const viewFullName = `${viewName}-${hashCode(JSON.stringify(filters))}-${this.appStore && this.appStore.loggedInUserKey}`;

    const view = this.view(viewFullName);
    const viewData = this.viewData(viewFullName);

    const url = this.sufix ? `${apiPath || this.modelRoot}/${this.sufix}` : `${apiPath || this.modelRoot}`;
    let promise;

    if ( forceRefresh || view.needsUpdate() ) {

      view.beginUpdate();
      const ModelClass = this.model;

      
      promise = this.adapter.search( url, filters )
        .then( 
          
          (res) => {
            // clear view
            view.clear();

            //clear viewData
            viewData.clear();

            // get the raw items
            const items = res['results'] || res;
            const contextData = res['headers'] || res;
            
            // iterate results
            if (Array.isArray(items)) {
              for (var i = 0, l = items.length; i < l; i++) {
                view.add( this.items.addOrUpdateModel( new ModelClass(items[i], this ) ) );
              }
            }
            else {
              view.add( this.items.addOrUpdateModel( new ModelClass(items, this ) ) );
            }
            
            viewData.merge(contextData);       

            view.endUpdate();

            return view;

          },
          (err) => {
            view.endUpdate(err);
            //throw err;
          });

    }

    // return returnPromise ? promise : view;

    return view;

  }


  @action
  get( id, forceRefresh = false, onFetch = null, filters, apiPath = null ) {

    const ModelClass = this.model;
    let item = this.items.find(id);

    if ( item === undefined ) {
      item = new ModelClass({ id: id }, this);

      this.items.add( item );
    }

    if ( forceRefresh || item.needsUpdate() ) {
      item.beginUpdate();
      this.adapter.get( apiPath || this.modelRoot, id, filters )
        .then(
          (res) => {
            this.items.addOrUpdateModel( new ModelClass(res['results'] || res, this) );
            item.endUpdate();

            onFetch && onFetch(item);
          },
          (err) => {
            item.endUpdate(err);
            // throw err; -- this ends the flow
          });
    }

    return item;
  }

  @action
  getFromData( itemData ) {

    const ModelClass = this.model;

    let item = this.items.find(itemData[ (new ModelClass())._primaryKey ]); 


    if ( item === undefined ) {
      item = new ModelClass(itemData, this);
      this.items.add(item);
    }
    else
    {
      item.beginUpdate();
      this.items.addOrUpdateModel( new ModelClass(itemData), this );
      item.endUpdate();
    }

    return item;
  }


  @action
  save( model, apiPath = null ) {

    model.beginUpdate();

    if ( model.isNew ) {
      this.adapter.post( apiPath || this.modelRoot, model )
        .then(
          (res) => {
            if( res && res['results'] ) {
              model.set(res['results'])
              this.items.addOrUpdateModel( model );
              model.endUpdate();
            }
          },
          (err) => {
            model.endUpdate(err);
            //throw err;
          });

    } 
    else {

      this.adapter.put( apiPath || this.modelRoot, model )
        .then(
          (res) => {
            if ( res && res['results']) {
              model.set(res['results'])
              this.items.addOrUpdateModel( model );
              model.endUpdate();
            }
          },
          (err) => {
            model.endUpdate(err);
            //throw err;
          });

    }
    return model;

  }


  @action
  destroy( model, apiPath = null ) {

    model.beginUpdate();

    this.adapter.delete( apiPath || this.modelRoot, model.id)
      .then(
        (res) => {
          this.items.addOrUpdateModel(model);
        },
        (err) => {
          model.endUpdate(err);
        });
  }

  @action 
  fetch( action, params, defaultData = {}, forceRefresh = false, apiPath = null, secure = true ) {
    const viewFullName = `${action}-${hashCode(JSON.stringify(params))}-${this.appStore && this.appStore.loggedInUserKey}`;
    let view = this.fetchResult(viewFullName, defaultData);
    

    if ( forceRefresh || view.needsUpdate() ) {
      const url =apiPath? apiPath: this.modelRoot;

      view.beginUpdate();
      this.adapter.search( `${url}/${action}`, params, secure )
        .then( 
          (res) => {
            // get the raw data
            const data = res['results'] || res;

            view.set(data);

            view.endUpdate();

          },
          (err) => {
            view.endUpdate(err);
            //throw err;
          });

    }

    return view;
  }



  @action
  store( json ) {
    const ModelClass = this.model;
    let item = this.items.find(json.id);
    
    if ( item === undefined ) {
      item = new ModelClass({ id: json.id }, this);

      this.items.add( item );
    }

    item.beginUpdate();
    
    this.items.addOrUpdateModel( new ModelClass(json, this) );

    item.endUpdate();

    return item;
  }  


  @action
  clear() {
    this.items.clear();

    this.views.forEach( (view, key) => { view.clear(); });
    this.views.clear();
  }


}