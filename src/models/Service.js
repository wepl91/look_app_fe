import { Model } from '../lib';

export default class Service extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      name: '',
      cost: '',
      duration: '',
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }
}