import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faUsers, faPlus } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

class UsersMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/users`, 'Usuarios');
    this.props.store.ui.registerRoute(`${path}/users/list`, 'Listado');
    this.props.store.ui.registerRoute(`${path}/users/new`, 'Nuevo');

  }

  render() {
    const path = this.props.match.path;

    return(
      <LayoutMenuLinkGroup icon={ faUsers } label="Usuarios" basePath={ `${path}/users` }>
        <LayoutMenuLink icon={ faUsers } to={ `${path}/users/list` }>Listado</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/users/new`  }>Nuevo usuario</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(UsersMenu));