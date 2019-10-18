import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { withStore } from '../../hocs';
import { withRouter } from 'react-router';
import { withToastManager } from 'react-toast-notifications';

import { UsersForm } from '../../components/Users';

import { ReactComponent as SvgDraw } from '../../assets/undraw_short_bio_e5pg.svg';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

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
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    const { toastManager } = this.props;
    this.newUser.fullName = `${this.newUser.name} ${this.newUser.lastname}`;
    this.setState({
      isSaving: true,
    }, () => {
      this.newUser.save().andThen((savedUser, responseError) => {
        if (responseError) {
          toastManager.add("Ups! Parece que hubo un error al guardar!", {
            appearance: 'error',
            autoDismiss: true,
            pauseOnHover: false,
          });
          this.setState({
            isSaving: false
          });
        }
        else {
          toastManager.add("El usuario ha sido creado exitosamente!", {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
        }
        this.props.history.push('list');
      });
    })
  }

  handleChange(name, value) {
    if (name == 'role') {
      this.newUser.roles[0] = value;
    }
    else {
      this.newUser[name] = value;
    }
  }

  componentDidMount() {
    this.newUser = new User({}, this.props.store.users);
  }

  render() {
    return (
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Nuevo usuario</Title>
          </LevelLeft>
        </Level>
        <hr />
        <Columns>
          <Column isSize={4} className="pl-4 pr-4 ml-5 mt-3">
            <UsersForm onChange={this.handleChange} />
          </Column>
          <Column isSize={2}></Column>
          <Column isSize={6} clasName="has-text-centeres">
            <SvgDraw style={{ height: '75%', width: '75%' }} />
          </Column>
        </Columns>
        {this.state.isSaving ?
          <Button kind="outline" className="ml-6" disabled pulse icon={faSpinner}>Creando usuario..</Button> :
          <Button kind="outline" className="ml-6" onClick={this.handleSave}>Crear usuario</Button>}
      </React.Fragment>)
  }
}

export default withToastManager(withStore(withRouter(UserCreation)));