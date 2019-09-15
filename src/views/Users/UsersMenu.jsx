import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

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
      <LayoutMenuLinkGroup icon="users" label="Usuarios" basePath={ `${path}/users/` }>
        <LayoutMenuLink icon="list" to={ `${path}/users/list`   }>Listado</LayoutMenuLink>
        <LayoutMenuLink icon="plus" to={ `${path}/users/new`    }>Nuevo usuario</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(UsersMenu));