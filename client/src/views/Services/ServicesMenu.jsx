import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faCut, faPlus } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react'

@observer
class ServicesMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/services`, 'Servicios');
    this.props.store.ui.registerRoute(`${path}/services/list`, 'Listado');

  }
  
  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const path = this.props.match.path;
    if (!this.props.store.loggedInUser.canSeeServices()) return null;
    return(
      <LayoutMenuLinkGroup icon={ faCut } label={ this.getText('Servicios') } basePath={ `${path}/services` }>
        <LayoutMenuLink icon={ faCut } to={ `${path}/services/list`  }>{ this.getText('Listado') }</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/services/new`   }>{ this.getText('Nuevo servicio') }</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(ServicesMenu));