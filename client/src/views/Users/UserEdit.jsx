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

@observer
class UserEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      user: null,
      edited: false,
    }

    this.handleSave   = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      user: this.props.store.users.get(this.props.match.params.id),
    });
  }
  
  handleChange(name, value, valid) {
    const { user } = this.state;
    if (name == 'role') {
      user.roles[0] = value;
    }
    if (name=='name' && value != user.cookedName) {
      user[name] = value;
      this.setState({
        edited: true,
        invalidName: valid.type == 'error',
      });
    } 
    else if (name=='lastName' && value != user.cookedLastName) {
      user[name] = value;
      this.setState({
        edited: true,
        invalidLastName: valid.type == 'error',
      });
    } 
    else if (name=='email' && value != user.email) {
      user[name] = value;
      this.setState({
        edited: true,
        invalidMail: valid.type == 'error',
      });
    }
    else if (name == 'password') {
      user.setField('password', value);
      this.setState({
        edited: true,
        invalidPassword: false,
      });
    }
  }

  handleSave() {
    const { toastManager } = this.props;
    let { user } = this.state;
    this.setState({
      isSaving: true,
    }, () => {
      user = user.clean();
      user.save().andThen((savedUser, responseError) => {
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
          toastManager.add("El usuario ha sido modificado exitosamente!", {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
        }
        this.props.history.push('list');
      });
    })
  }

  getDisabled() {
    if (this.state.edited) {
      return this.state.invalidName || this.state.invalidLastName || this.state.invalidMail || this.state.user.roles.length < 1 || this.state.invalidPassword;
    }
    else {
      return true
    }
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const userLoaded = this.state.user && this.state.user.isOk();
    if (!userLoaded) {
      return this.getText('Cargando..')
    }
    return (
      <React.Fragment>
          <Level>
            <LevelLeft>
              <Title>{ this.getText("Editar usuario") }</Title>
            </LevelLeft>
          </Level>
          <hr />
          <Columns>
            <Column isSize={4} className="pl-4 pr-4 ml-5 mt-3">
              <UsersForm user={ this.state.user } onChange={this.handleChange} withPassword withoutRole />
              <br />
              {this.state.isSaving ?
                <Button kind="outline" disabled pulse icon={faSpinner}>Guardando</Button> :
                <Button kind="outline" onClick={this.handleSave} disabled={ this.getDisabled() }>Guardar</Button>}
            </Column>
            <Column isSize={2}></Column>
            <Column isSize={6} clasName="has-text-centered">
              <SvgDraw style={{ height: '75%', width: '75%' }} />
            </Column>
          </Columns>
        </React.Fragment>)
  }
}

export default withRouter(withStore(withToastManager(UserEdit)))