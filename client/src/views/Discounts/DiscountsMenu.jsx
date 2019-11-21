import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faPlus, faPercent } from "@fortawesome/free-solid-svg-icons";

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react'

@observer
class DiscountsMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/discounts`, 'Promociones');
    this.props.store.ui.registerRoute(`${path}/discounts/list`, 'Listado');

  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const path = this.props.match.path;
    if (!this.props.store.loggedInUser.canSeePromotions()) return null;
    return(
      <LayoutMenuLinkGroup icon={ faPercent } label={ this.getText('Promociones') } basePath={ `${path}/discounts` }>
        <LayoutMenuLink icon={ faPercent } to={ `${path}/discounts/list`  }>{ this.getText('Listado') }</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/discounts/new`   }>{ this.getText('Nueva promoción') }</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(DiscountsMenu));