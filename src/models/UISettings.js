import { Model } from '../lib';

export default class UISettings extends Model {

  constructor( attributes, store ) {

    let defaultAttributes = {
      layout: {
        expandedMenu: true,
      },
      language: 'spn'
    };

    let attrs = Object.assign( defaultAttributes, attributes );

    super(attrs, store);
  }

}