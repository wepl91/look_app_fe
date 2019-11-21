import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faUsers, faPlus } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react'

@observer
class UsersMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/users`, 'Usuarios');
    this.props.store.ui.registerRoute(`${path}/users/list`, 'Listado');
    this.props.store.ui.registerRoute(`${path}/users/new`, 'Nuevo');

  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const path = this.props.match.path;   
    if (!this.props.store.loggedInUser.canSeeUsers()) return null;
    return(
      <LayoutMenuLinkGroup icon={ faUsers } label={ this.getText('Usuarios') } basePath={ `${path}/users` }>
        <LayoutMenuLink icon={ faUsers } to={ `${path}/users/list` }>{ this.getText('Listado') }</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/users/new`  }>{ this.getText('Nuevo usuario') }</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(UsersMenu));