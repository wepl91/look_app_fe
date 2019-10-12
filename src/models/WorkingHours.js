import { Model } from '../lib';

export default class WorkingHours extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      days: '',
      beginHour: '',
      endHour: '',
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }
  
}