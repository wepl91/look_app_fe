import { Model } from '../lib';

export default class User extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }
}