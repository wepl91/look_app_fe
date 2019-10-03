import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStore } from '../../hocs';

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

import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

import startCase from 'lodash/startCase'

class UserLoggedDropdown extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

  }

  handleClick() {
    this.props.store.signOut();
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
              <Text className="mb-1"weight="medium">{ user.username && startCase(user.username)  }</Text>
              <Text className="mt-1 mb-1"weight="medium">{ user.userRole && startCase(user.userRole) }</Text>
              <Button className="mt-1" kind="outline" icon={ faSignOutAlt } onClick={ this.handleClick }>Cerrar sesión</Button>
              </Column>
          </Columns>
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

export default withStore(UserLoggedDropdown);