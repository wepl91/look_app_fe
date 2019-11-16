import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStore } from '../../hocs';
import { withRouter } from 'react-router';

import {
  Dropdown,
  DropdownToggle,
  DropdownPanel,
  Text,
  Button,
  SelectableIcon,
  Avatar,
} from 'shipnow-mercurio';

import {
  Columns,
  Column
} from 'bloomer'

import { faUser, faSignOutAlt, faUserEdit } from "@fortawesome/free-solid-svg-icons";

import startCase from 'lodash/startCase'

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react'

@observer
class UserLoggedDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleClick    = this.handleClick.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);

  }

  handleRedirect() {
    this.props.history.push(`/app/users/${ this.props.user.id }`)
  }

  handleClick() {
    this.props.store.signOut();
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const { user } = this.props
    return(
      <Dropdown className="mr-2" direction="bottom-right">
        <DropdownToggle>
          <SelectableIcon icon={ faUser } readOnly size="xs"/>
        </DropdownToggle>
        <DropdownPanel>
          <Columns className="has-text-centered">
            <Column>
              <Avatar image="https://codewebbarcelona.com/wp-content/uploads/2019/01/095_logo-peluqueria.jpg"/>
              <Text className="mb-1" weight="medium">{ user.username && startCase(user.username)  }</Text>
              <Text className="mt-1" weight="medium">{ user.userRole && startCase(this.getText(user.userRole)) }</Text>
              </Column>
              </Columns>
              <Button className="mt-1 ml-1 mr-1" kind="link" icon={ faUserEdit } onClick={ this.handleRedirect }>{this.getText("Editar perfil")}</Button>
              <Button className="mt-1 ml-1 mr-1" kind="link" icon={ faSignOutAlt } onClick={ this.handleClick } >{this.getText("Cerrar sesión")}</Button>
        </DropdownPanel>
      </Dropdown> )
  }
}

UserLoggedDropdown.PropTypes = {
  user: PropTypes.object,
}

UserLoggedDropdown.defaultProps = {
  user: null
}

export default withRouter(withStore(UserLoggedDropdown));