import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

import { withStore } from '../../hocs';

import {
  Field,
  TextInput,
  Select,
} from 'shipnow-mercurio'

import {
  Columns,
  Column
} from 'bloomer'

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

@observer
class UsersForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roles: null,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      roles: this.props.store.roles.search({}, 'roles-list-users-form', true),
    })    
  }

  handleChange( sender, value, name ) {
    if (name == 'role') {
      this.props.onChange && this.props.onChange(name, value); 
    }
    else {
      this.props.onChange && this.props.onChange(name, value);
    }
  }

  getRolesList() {
    const roles = [];
    this.state.roles.toArray().forEach(rol => {
      roles.push({
        key: rol.name,
        value: rol.id
      });
    });
    return roles;
  }

  renderSkeleton() {
    return(
      <React.Fragment>
        <Field label="Nombre y Apellido" labelNote="¿Cómo se llama el nuevo usuario?">
          <Columns isGapless isMarginless>
            <Column>
                <TextInput name="name" placeholder="Nombre.." disabled />
            </Column>
            <Column>
                <TextInput name="lastname" placeholder="Apellido.." disbaled />
            </Column>
          </Columns>
        </Field>
        <Field label="Email">
          <TextInput name="email" placeholder="user@gmail.com" disabled />
        </Field>
        <Field label="Rol">
        <Select 
          maxHeight="110px"
          name="role"
          placeholder="Roles" 
          borderless 
          icon={ faChevronDown } 
          disabled />
        </Field>
      </React.Fragment> )
  }

  render() {
    if (!this.state.roles || !this.state.roles.isOk()) {
      return this.renderSkeleton();
    }
    const { user } = this.props;
    return(
      <React.Fragment>
        <Field label="Nombre y Apellido" labelNote="¿Cómo se llama el nuevo usuario?">
          <Columns isGapless isMarginless>
            <Column>
                <TextInput value={ user && user.cookedName } name="name" placeholder="Nombre.." onChange={ this.handleChange } />
            </Column>
            <Column>
                <TextInput value={ user && user.cookedLastname } name="lastname" placeholder="Apellido.." onChange={ this.handleChange } />
            </Column>
          </Columns>
        </Field>
        <Field label="Email">
          <TextInput value={ user && user.email } name="email" placeholder="user@gmail.com" onChange={ this.handleChange } />
        </Field>
        <Field label="Rol">
        <Select 
          key={ this.state.roles } 
          value={ user && user.roleID }
          name="role"
          placeholder="Roles" 
          borderless 
          icon={ faChevronDown } 
          options={ this.getRolesList() }
          onChange={ this.handleChange } />
        </Field>
      </React.Fragment> )
  }
  
}

UsersForm.PropTypes = {
  user: PropTypes.object,
  onChange: PropTypes.func,
}

UsersForm.defaultProps = {
  user: null,
  onChange: null,
}

export default withStore(UsersForm);