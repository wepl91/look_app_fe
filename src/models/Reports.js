import { Model } from '../lib';
import {
  action,
  computed,
} from 'mobx'

import { 
  Professional, 
  Branch 
} from '../models';

import { 
  ProfessionalsStore, 
  BranchesStore 
} from '../stores'

export default class Reports extends Model {
  constructor( attributes, store ) {
    super(attributes, store);
  }

  afterSetData() {
    if (this.professional) {
      this.professional = new Professional(this.professional, ProfessionalsStore);
    }
    if (this.branch) {
      this.branch = new Branch(this.branch, BranchesStore);
    }
  }
  
}