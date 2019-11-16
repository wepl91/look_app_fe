import { action, observable, computed } from 'mobx';
import { RESTClient, LocalStorageClient } from '../lib';

import { 
  UIStore, 
  UsersStore,
  RolesStore,
  ServicesStore,
  ProfessionalsStore,
  AppointmentsStore,
  ClientsStore,
  BranchesStore,
  ConfigsStore,
  ReportsStore,
  AccountanciesStore,
  DiscountsStore
} from './';

export default class AppStore {
  @observable isLoading = true;
  @observable loggedInUser = null;
  @observable serviceErrors = []

  api_token_key   = `la_${"http://localhost:8080"}_token`;
  logged_user_key = `la_${"http://localhost:8080"}_user`;
  settings = {
    refreshRate: 5, // in minutes
  };


  constructor() {

    const storedToken = localStorage.getItem(this.api_token_key);
    const storedUser  = localStorage.getItem(this.logged_user_key);

    //Set by default when app is up in spanish

    
    // create adapters
    this.APIClient = new RESTClient("http://localhost:8080", storedToken);
                                                                                        
    this.localStorageClient = new LocalStorageClient('la');

    // initialize stores
    this.stores = new Map();

    // Domain stores
    this.stores.set('users',          new UsersStore(this.APIClient, this));
    this.stores.set('roles',          new RolesStore(this.APIClient, this));
    this.stores.set('clients',        new ClientsStore(this.APIClient, this));
    this.stores.set('services',       new ServicesStore(this.APIClient, this));
    this.stores.set('branches',       new BranchesStore(this.APIClient, this));
    this.stores.set('configs',        new ConfigsStore(this.APIClient, this));
    this.stores.set('reports',        new ReportsStore(this.APIClient, this));
    this.stores.set('professionals',  new ProfessionalsStore(this.APIClient, this));
    this.stores.set('appointments',   new AppointmentsStore(this.APIClient, this));
    this.stores.set('accountancies',  new AccountanciesStore(this.APIClient, this));
    this.stores.set('discounts',      new DiscountsStore(this.APIClient, this));
   
    // UI stores
    this.stores.set('ui', new UIStore(this.localStorageClient, this));

    // create easy stores getters
    this.stores.forEach( (store, key) => { 
      Object.defineProperty(this, key, { 
        get: (v) => store,
        
      });

      store.updateThreshold = this.settings.refreshRate;
    });


    // is already a session open?
    //if ( storedToken && storedUser ) {
      if ( storedUser ) {
      this.isLoading = false;
      this.users.get(storedUser).andThen( ( res, err ) => {
        if (err) {
          // something went terrible wrong.... 
          this.signOut();
          this.isLoading = false;
        }
        else {
          this.setCurrentUser(res);
          this.isLoading = false;
        }

      });

    }
    else {
      this.isLoading = false;
    }

  }

  @action
  signOut() {
    localStorage.removeItem(this.api_token_key);
    localStorage.removeItem(this.logged_user_key);

    this.APIClient.token = null;
    this.loggedInUser = null;
    this.stores.forEach( (store, key) => { store.clear() } );
  }

  @action
  signIn( user, password ) {
    return this.authenticate(user, password).then( res => {
      this.saveInfo(res)
    });
  }

  @action
  authenticate( user, password ) {
    return this.APIClient.authenticate(user, password)
  }

  @action
  saveInfo( data ) {
    this.setCurrentUser(this.users.store(data));

    // save the info in storage
    localStorage.setItem(this.api_token_key, this.APIClient.token);
    localStorage.setItem(this.logged_user_key, this.loggedInUser.id);
    localStorage.setItem('language', 'Español');
  }

  @action
  recoverPassword( email ) {
    return this.APIClient.password_recovery(email)
  }

  @action resetPassword( token, email ) {
    return this.APIClient.update_password(token, email);
  }

  @action
  setCurrentUser( user ) {
    this.isLoading = false;
    this.loggedInUser = user;
  }

  @computed
  get isLoggedIn() {
    const loggedInUser = this.loggedInUser; // I need to do this for MOBX to catch it....
    return this.APIClient.token != null && loggedInUser != null;
  }

  @computed
  get isLoggingIn() {
    const loggedInUser = this.loggedInUser; // I need to do this for MOBX to catch it....
    return this.APIClient.token != null && loggedInUser == null;
  }

  @computed
  get loggedInUserKey() {
    if ( this.isLoggedIn ) {
      return this.loggedInUser.id;
    }

    return null;
  }
  
  getCurrentTheme() {
    const primaryColors = { // brand colors
      base             : '#e30000',
      dark             : '#b51b1b',
      darker           : '#830d0d',
      darkest          : '#621818',
      black            : '#520000',
      light            : '#dd8989',
      lighter          : '#e5c4c4',
      lightest         : '#f0e2e2',
      white            : '#faf2f2',
    };
    
    const neutralColors = {
      black            : '#2E3A41',
      gray0            : '#4B555B',
      gray1            : '#666F74',
      gray2            : '#82898D',
      gray3            : '#9DA3A7',
      gray4            : '#B8BDBF',
      gray5            : '#D4D6D8',
      gray6            : '#E7E8EA',
      gray7            : '#F0F1F2',
      gray8            : '#F7F9F9',
      gray9            : '#FDFEFF',
      white            : '#FFFFFF',
    };
    
    const paletteColors = {
      blue             : '#209CEE',
      blueLight        : '#BBE1F9',
      blueDark         : '#2479B0',
      green            : '#23D160',
      greenLight       : '#BCF1CF',
      greenDark        : '#269B54',
      yellow           : '#FFDC00',
      yellowLight      : '#FFF4B2',
      yellowDark       : '#B4A217',
      orange           : '#FF9F1C',
      orangeLight      : '#FFE2BA',
      orangeDark       : '#B47B29',
      red              : '#FF3860',
      redLight         : '#FFC3CF',
      redDark          : '#B43854',
      purple           : '#B053E0',
      purpleLight      : '#E7CBF5',
      purpleDark       : '#814AA7',
    
      blackDark        : neutralColors.gray0,
      black            : neutralColors.gray1,
      blackLight       : neutralColors.gray2,
    
      grayDark         : neutralColors.gray3,
      gray             : neutralColors.gray4,
      grayLight        : neutralColors.gray5,
    
      whiteDark        : neutralColors.gray6,
      white            : neutralColors.gray7,
      whiteLight       : neutralColors.gray8,
    };
    
    const actionColors = {
      primary          : primaryColors.dark,
      secondary        : primaryColors.light,
      confirm          : paletteColors.green,
      warning          : paletteColors.orange,
      remove           : paletteColors.red,
      internal         : paletteColors.purple,
    
      primaryLight     : primaryColors.light,
      secondaryLight   : primaryColors.lightest,
      confirmLight     : paletteColors.greenLight,
      warningLight     : paletteColors.orangeLight,
      removeLight      : paletteColors.redLight,
      internalLight    : paletteColors.purpleLight,
    
      primaryDark      : primaryColors.darkest,
      secondaryDark    : primaryColors.darker,
      confirmDark      : paletteColors.greenDark,
      warningDark      : paletteColors.orangeDark,
      removeDark       : paletteColors.redDark,
      internalDark     : paletteColors.purpleDark,
    };
    
    const messageColors = {
      information      : paletteColors.blue,
      success          : paletteColors.green,
      warning          : paletteColors.orange,
      error            : paletteColors.red,
      attention        : paletteColors.purple,
      informationLight : paletteColors.blueLight,
      successLight     : paletteColors.greenLight,
      warningLight     : paletteColors.orangeLight,
      errorLight       : paletteColors.redLight,
      attentionLight   : paletteColors.purpleLight,
      informationDark  : paletteColors.blueDark,
      successDark      : paletteColors.greenDark,
      warningDark      : paletteColors.orangeDark,
      errorDark        : paletteColors.redDark,
      attentionDark    : paletteColors.purpleDark,
    };
    
    const statusColors = {
      inProgress       : paletteColors.blue,
      done             : paletteColors.green,
      toDo             : paletteColors.purple,
      failed           : paletteColors.red,
      new              : paletteColors.orange,
      noStatus         : neutralColors.gray5,
      inProgressLight  : paletteColors.blueLight,
      doneLight        : paletteColors.greenLight,
      toDoLight        : paletteColors.purpleLight,
      failedLight      : paletteColors.redLight,
      newLight         : paletteColors.orangeLight,
      noStatusLight    : neutralColors.gray7,
      inProgressDark   : paletteColors.blueDark,
      doneDark         : paletteColors.greenDark,
      toDoDark         : paletteColors.purpleDark,
      failedDark       : paletteColors.redDark,
      newDark          : paletteColors.orangeDark,
      noStatusDark     : neutralColors.gray3,
    };
    
    const availabilityColors = {
      unavailable      : primaryColors.lighter,
      available        : paletteColors.green,
      busy             : paletteColors.red,
      unavailableLight : primaryColors.lightest,
      availableLight   : paletteColors.greenLight,
      busyLight        : paletteColors.redLight,
      unavailableDark  : primaryColors.dark,
      availableDark    : paletteColors.greenDark,
      busyDark         : paletteColors.redDark,
    };
    
    const priorityColors = {
      trivial          : primaryColors.lighter,
      minor            : paletteColors.green,
      medium           : paletteColors.orange,
      critical         : paletteColors.red,
      trivialLight     : primaryColors.lightest,
      minorLight       : paletteColors.greenLight,
      mediumLight      : paletteColors.orangeLight,
      criticalLight    : paletteColors.redLight,
      trivialDark      : primaryColors.dark,
      minorDark        : paletteColors.greenDark,
      mediumDark       : paletteColors.orangeDark,
      criticalDark     : paletteColors.redDark,
    };
    
    const uiColors = {
      text       : neutralColors.black,
      lightText  : neutralColors.gray4,
      background : neutralColors.gray8,
      borders    : neutralColors.gray6,
    };
    
    const defaultIcons = {
      'message': {
        'information' : 'info-circle',
        'success'     : 'check-circle',
        'warning'     : 'exclamation-triangle',
        'error'       : 'times-circle',
        'attention'   : 'exclamation-circle',
      },
      'ui': {
        'help'        : 'question', 
      },
    };
    
    // build theme
    return {
      colors : {
        primary          : primaryColors,
        palette          : paletteColors,
        neutral          : neutralColors,
        action           : actionColors,
        message          : messageColors,
        status           : statusColors,
        availability     : availabilityColors,
        priority         : priorityColors,
        ui               : uiColors,
        all              : Object.assign(
                            {},
                            paletteColors, 
                            actionColors, 
                            messageColors, 
                            statusColors, 
                            availabilityColors, 
                            priorityColors,
                            uiColors ),
      },
      icons              : defaultIcons,
    };
  }
}
