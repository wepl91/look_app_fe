import {
  observable,
  action,
  computed,} from 'mobx';

import { Store } from '../lib';
import { UISettings } from '../models';

export default class UIStore extends Store {

  model = UISettings;
  urlRoot = 'UI';
  @observable language;
  @observable configs

  constructor(adapter, appStore) {
    super(adapter, appStore);

    // initialize static value lists
    this.language = localStorage.getItem('language');
  }


  @observable
  routes = {
    '/app': 'Inicio',
  };

  @action
  registerRoutes(_routes) {
    this.routes = Object.assign( this.routes, _routes );
  }

  @action
  registerRoute(route, label) {
    this.routes[route] = label;
  }

  @action
  setLanguageToSpanish() {
    localStorage['language'] = 'Español';
    this.language = 'Español';
  }

  @action
  setLanguageToEnglish() {
    localStorage['language'] = 'Ingles';
    this.language = 'Ingles';
  }

  define(list, value) {
    const found = this.lists[list].find( x => x.value == value );

    return found ? found.key : value;
  }

  get settings() {

    if ( this.appStore.loggedInUser ) {
      return this.get(this.appStore.loggedInUser.id);
    }

    return new UISettings({}, this);
  }

}
