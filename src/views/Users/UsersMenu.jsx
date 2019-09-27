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
      <LayoutMenuLinkGroup label="Usuarios" basePath={ `${path}/users/` }>
        <LayoutMenuLink to={ `${path}/users/list`   }><FontAwesomeIcon className="mr-2" icon={ faUsers }/>Listado</LayoutMenuLink>
        <LayoutMenuLink to={ `${path}/users/new`    }><FontAwesomeIcon className="mr-2" icon={ faPlus }/>Nuevo usuario</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(UsersMenu));