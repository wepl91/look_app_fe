import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { withStore } from '../../hocs';
import { withRouter } from 'react-router';
import { withToastManager } from 'react-toast-notifications';

import { UsersForm } from '../../components/Users';

import { ReactComponent as SvgDraw } from '../../assets/undraw_short_bio_e5pg.svg';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { translate } from '../../lib/Translator';

import {
  Columns,
  Column,
  Level,
  LevelLeft
} from 'bloomer';

import {
  Title,
  Button
} from 'shipnow-mercurio';


import { User } from '../../models';

@observer
class UserCreation extends Component {

  newUser

  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      validName: false,
      validLastName: false,
      validMail: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    const { toastManager } = this.props;
    this.newUser.status = 'ACTIVE';
    this.setState({
      isSaving: true,
    }, () => {
      this.newUser.save().andThen((savedUser, responseError) => {
        if (responseError) {
          toastManager.add(this.getText("Ups! Parece que hubo un error al guardar!"), {
            appearance: 'error',
            autoDismiss: true,
            pauseOnHover: false,
          });
          this.setState({
            isSaving: false
          });
        }
        else {
          toastManager.add(this.getText("El usuario ha sido creado exitosamente!"), {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
        }
        this.props.history.push('list');
      });
    })
  }

  handleChange(name, value, valid) {
    if (name == 'role') {
      this.newUser.roles[0] = value;
    }
    else {
      this.newUser[name] = value;
    }
    if(name=='name'){
      this.setState({
        validName: valid.type == 'success',
      })
    } else
    if(name=='lastName'){
      this.setState({
        validLastName: valid.type == 'success',
      })
    } else
    if(name=='email'){
      this.setState({
        validMail: valid.type == 'success',
      })
    }
    if (this.newUser.name && this.newUser.lastName) {
      this.newUser.email = `${ this.newUser.name.substring(0,1).toLowerCase() }.${ this.newUser.lastName.toLowerCase() }@gmail.com`
    }
  }

  getDisabled() {
    return !(this.state.validName && this.state.validLastName && this.state.validMail && this.newUser.roles.length > 0)
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  componentDidMount() {
    this.newUser = new User({}, this.props.store.users);
  }

  render() {
    return (
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{this.getText("Nuevo usuario")}</Title>
          </LevelLeft>
        </Level>
        <hr />
        <Columns>
          <Column isSize={4} className="pl-4 pr-4 ml-5 mt-3">
            <UsersForm user={ this.newUser } onChange={this.handleChange} />
          </Column>
          <Column isSize={2}></Column>
          <Column isSize={6} clasName="has-text-centered">
            <SvgDraw style={{ height: '75%', width: '75%' }} />
          </Column>
        </Columns>
        {this.state.isSaving ?
          <Button kind="outline" className="ml-6" disabled pulse icon={faSpinner}>{this.getText("Creando usuario..")}</Button> :
          <Button kind="outline" className="ml-6" onClick={this.handleSave} disabled={ this.getDisabled() }>{this.getText("Crear usuario")}</Button>}
      </React.Fragment>)
  }
}

export default withToastManager(withStore(withRouter(UserCreation)));