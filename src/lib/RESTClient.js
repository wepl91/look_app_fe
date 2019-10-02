import {
  observable,
  action,
} from 'mobx'

export default class RESTClient {
  apiURI = '';
  @observable token = null;

  constructor( apiURI, token ) {
    this.apiURI = apiURI;
    this.token = token;
  }

  @action
  authenticate( user, password, authPath = '/login' ) {
    let credentials = Buffer(`${user}:${password}`).toString('base64');
    return this.sendRequest(authPath, 'POST', {username: user, password: password}, false)
      .then( res => {
        this.token = res['results']['token'] || res['results'];
        return res.results;
      })
      .catch( error => {
        return Promise.reject(error)
      })
  }

  @action
  password_recovery( email, authPath = '/users/password_recovery') {
    return this.sendRequest( authPath, 'POST', { email: email }, false)
  }

  @action
  update_password( token, password, authPath = '/users/password_update') {
    return this.sendRequest( authPath, 'POST', { password_reset_token: token, password: password }, false );
  }

  search(uriPath, filters = {}, secure = true) {

    return this.sendRequest(
        `${uriPath}${this.getFiltersUrl(filters)}`,
        'GET',
        null,
        secure);
  }

  get(uriPath, id = null, filters = {}) {
    return this.sendRequest(
      id ? `${uriPath}/${id}${this.getFiltersUrl(filters)}` :  `${uriPath}${this.getFiltersUrl(filters)}`, 
      'GET');
  }

  post(uriPath, item) {
    return this.sendRequest(
      uriPath, 
      'POST', 
      item.toParams ? item.toParams() : item );
  }

  put(uriPath, item, itemId = null) {
    return this.sendRequest(
      `${uriPath}/${itemId || item.id}`,  
      'PUT', 
      item.toParams ? item.toParams() : item );
  }

  delete(uriPath, id) {
    return this.sendRequest(
      `${uriPath}/${id}`, 
      'DELETE');
  }

  sendRequest(uriPath, method = 'GET', params = null, secure = true, customHeaders = {}) {

    const url = `${this.apiURI}${uriPath}`;

    let headers = {
        'Content-Type': 'application/json',
        'pragma': 'no-cache',
        'cache-control': 'no-cache',
        'mode': 'no-cors'
      };

    let request = {
        'method': method,
        'headers': headers,
      };

    if ( method != 'GET' && params != null ) {
      request = Object.assign( request, {
        body: JSON.stringify(params),
      });
    }
    return fetch( url, request )
      .then( res => {
        if ( res.ok ) {
          let headers = {};
          
          for(var h of res.headers.entries()) {
              headers[[h[0]][0]] = [h[1]][0];
          }
          return res.json().then( content => ({
            results: content.results || content,
            headers: headers
          })).catch(err => { 
              return Promise.resolve(res); // empthy response
          });
        }
        return res.json().then( content => {
          return Promise.reject(new Error(JSON.stringify(content)))
        })
      })
      .catch( err => {
          return Promise.reject(err);
      });

  }

  parseFilterValue( value ) {

    if ( value._isAMomentObject )
    {
      return value.toISOString();
    }

    return value;
  }

  getFiltersUrl(filters) {
    let result = [];

    for (var key in filters) {
      if ( filters[key] == undefined ) { // what is this case for?
        result.push(key);
      }
      else {
        result.push(`${key}=${this.parseFilterValue(filters[key])}`);
      }
    }

    return `?${result.join('&')}`;
  }  
}
