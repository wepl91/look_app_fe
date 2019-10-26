import { Model } from '../lib';
import {
  action,
  computed,
} from 'mobx'

import startCase from 'lodash/startCase';

export default class Branch extends Model {
  constructor( attributes, store ) {

    let defaultAttributes = {
      
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }
}