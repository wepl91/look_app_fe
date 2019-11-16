export default class MiddleClient {
  constructor() {
    this.baseUrl = '/api';
  }

  sendInvite(data) {
    return fetch(`${this.baseUrl}/google_invite/send`, {
      method: 'POST',
      body: JSON.stringify(data), // data can be {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    });
    // .then(res => res.json())
    // .then(response => console.log('Success:', response));
  }
}