import { Model } from '../lib';
import {
  action,
  computed,
} from 'mobx'

export default class Configs extends Model {
  constructor( attributes, store ) {
    super(attributes, store);
  }
  
  @action
  convertPoints(points){
    if (points == null){
      return 0
    }
    if (this.key=='changePay'){
      return points * this.value
    }
    return points / this.value
  }
}