import { Model } from '../lib';
import {
  action,
  computed,
} from 'mobx'

export default class Client extends Model {
  constructor( attributes, store ) {
    super(attributes, store);
  }

  @computed
  get category() {
    const status = {
      'VIP': 'VIP',
      'NORMAL': 'Normal',
      'MOROSO': 'Moroso'
    };

    return status[this.status.name];
  }
}