import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faChild, faPlus } from "@fortawesome/free-solid-svg-icons";

class ClientsMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/clients`, 'Clientes');
    this.props.store.ui.registerRoute(`${path}/clients/list`, 'Listado');
    this.props.store.ui.registerRoute(`${path}/clients/new`, 'Nuevo');

  }

  render() {
    const path = this.props.match.path;

    return(
      <LayoutMenuLinkGroup icon={ faChild } label="Clientes" basePath={ `${path}/users` }>
        <LayoutMenuLink icon={ faChild } to={ `${path}/clients/list` }>Listado</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/clients/new`  }>Nuevo cliente</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(ClientsMenu));