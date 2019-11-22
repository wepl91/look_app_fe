import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faChild, faPlus, faPiggyBank } from "@fortawesome/free-solid-svg-icons";

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react'

@observer
class ClientsMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/clients`, 'Clientes');
    this.props.store.ui.registerRoute(`${path}/clients/list`, 'Listado');
    this.props.store.ui.registerRoute(`${path}/clients/new`, 'Nuevo');

  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const path = this.props.match.path;
    if (!this.props.store.loggedInUser.canSeeClients()) return null;
    return(
      <LayoutMenuLinkGroup icon={ faChild } label={ this.getText('Clientes') } basePath={ `${path}/clients` }>
        <LayoutMenuLink icon={ faChild } to={ `${path}/clients/list` }>{ this.getText('Listado') }</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/clients/new`  }>{ this.getText('Nuevo cliente') }</LayoutMenuLink>
        <LayoutMenuLink icon={ faPiggyBank } to={ `${path}/clients/accountancy`  }>{ this.getText('Cuentas corrientes') }</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(ClientsMenu));