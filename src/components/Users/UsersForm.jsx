import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

import { withStore } from '../../hocs';

import { nameRegex, mailRegex } from '../../lib/Regex'

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

import { translate } from '../../lib/Translator';

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

  handleChange( sender, value, name, valid ) {
    this.props.onChange && this.props.onChange(name, value, valid);
  }

  getRolesList() {
    const roles = [];
    this.state.roles.toArray().forEach(rol => {
      roles.push({
        key: this.getText(rol.name),
        value: rol.id
      });
    });
    return roles;
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  renderSkeleton() {
    return(
      <React.Fragment>
        <Field label={this.getText("Nombre y Apellido")} labelNote={this.getText("¿Cómo se llama el nuevo usuario?")}>
          <Columns isGapless isMarginless>
            <Column>
                <TextInput name="name" placeholder={this.getText("Nombre..")} disabled />
            </Column>
            <Column>
                <TextInput name="lastName" placeholder={this.getText("Apellido..")} disbaled />
            </Column>
          </Columns>
        </Field>
        <Field label="Email">
          <TextInput name="email" placeholder="user@gmail.com" disabled />
        </Field>
        <Field label={this.getText("Rol")}>
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
        <Field label={this.getText("Nombre y Apellido")} labelNote={this.getText("¿Cómo se llama el nuevo usuario?")}>
          <Columns isGapless isMarginless>
            <Column>
                <TextInput value={ user && user.cookedName } validate={ (value) => (nameRegex.test(value)) } name="name" placeholder={this.getText("Nombre")} onChange={ this.handleChange } />
            </Column>
            <Column>
                <TextInput value={ user && user.cookedLastname } validate={ (value) => (nameRegex.test(value)) } name="lastName" placeholder={this.getText("Apellido")} onChange={ this.handleChange } />
            </Column>
          </Columns>
        </Field>
        <Field label="Email">
          <TextInput value={ user && user.email } name="email" validate={ (value) => (mailRegex.test(value)) } placeholder="user@gmail.com" onChange={ this.handleChange } />
        </Field>
        <Field label={this.getText("Rol")}>
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