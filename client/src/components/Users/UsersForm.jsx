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
      branches: null,
      password: '',
      repeatPassword: '',
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      roles: this.props.store.roles.search({}, 'roles-list-users-form', true),
      branches: this.props.store.branches.search({}, 'branches-list-users-form', true),
    })    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.repeatPassword != this.state.repeatPassword && (this.state.repeatPassword == this.state.password)) {
      this.props.onChange('password', this.state.password);
    } 
  }
  

  handleChange( sender, value, name, valid ) {
    if (name == 'password' || name == 'repeatPassword') {
      this.setState({
        [name]: value
      });
    }
    else {
      if (name == 'role') {
        const newRole = this.state.roles.toArray().find(rol => rol.id == value);
        this.props.onChange && this.props.onChange(name, newRole, valid);
      }
      this.props.onChange && this.props.onChange(name, value, valid);
    }
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
    const { withPassword } = this.props;
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
        <Field label={ this.getText('Sucursal') } labelNote={ this.getText('¿En qué sucursal va a trabajar el ususario?') }>
          <Select 
            disabled
            name="branch"
            icon={ faChevronDown } 
            borderless 
            placeholder={ this.getText('Sucursales') }
          />
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
        { withPassword &&
          <React.Fragment>
            <Field label={ this.getText('Contraseña') }>
              <TextInput type="password" securityLevel disabled />
            </Field>
            <Field className="mt-3" label={ this.getText('Confirmación de contraseña') }>
              <TextInput type="password" disabled />
            </Field>
          </React.Fragment> }
      </React.Fragment> )
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const isRolesLoaded = this.state.roles && this.state.roles.isOk();
    const isBranchesLoaded = this.state.branches && this.state.branches.isOk();
    if (!isBranchesLoaded || !isRolesLoaded) {
      return this.renderSkeleton();
    }
    const { user, withPassword } = this.props;
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
        <Field label={ this.getText('Email') }>
          <TextInput value={ user && user.email } name="email" validate={ (value) => (mailRegex.test(value)) } placeholder="user@gmail.com" onChange={ this.handleChange } />
        </Field>
        <Field label={ this.getText('Sucursal') } labelNote={ this.getText('¿En qué sucursal va a trabajar el ususario?') }>
          <Select 
            key={ this.state.branches }
            value={ user && user.cookedBranchId }
            name="branch"
            icon={ faChevronDown } 
            borderless 
            placeholder={ this.getText('Sucursales') }
            onChange={ this.handleChange }
            options={ this.state.branches.toArray().map( branch => ({ key: branch.name || branch.cookedAddress, value: branch.id })) }
          />
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
        { withPassword &&
          <React.Fragment>
            <Field label={ this.getText('Contraseña') }>
              <TextInput name="password" type="password" securityLevel onChange={ this.handleChange } />
            </Field>
            <Field className="mt-3" label={ this.getText('Confirmación de contraseña') }>
              <TextInput name="repeatPassword" type="password" onChange={ this.handleChange } />
            </Field>
          </React.Fragment> }
      </React.Fragment> )
  }
  
}

UsersForm.PropTypes = {
  user: PropTypes.object,
  onChange: PropTypes.func,
  withPassword: PropTypes.bool,
}

UsersForm.defaultProps = {
  user: null,
  onChange: null,
  withPassword: false,
}

export default withStore(UsersForm);