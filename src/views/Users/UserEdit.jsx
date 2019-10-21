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

@observer
class UserEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      user: null
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
    else {
      user[name] = value;
    }
    if(name=='name'){
      this.setState({
        validName: valid.type == 'success',
      })
    } 
    else if(name=='lastName'){
      this.setState({
        validLastName: valid.type == 'success',
      })
    } 
    else if(name=='email'){
      this.setState({
        validMail: valid.type == 'success',
      })
    }
  }

  handleSave() {
    const { toastManager } = this.props;
    const { user } = this.state;
    user.fullName = `${user.name} ${user.lastName}`;
    this.setState({
      isSaving: true,
    }, () => {
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

  getDisabled() {
    return !(this.state.validName && this.state.validLastName && this.state.validMail && this.state.user.roles.length > 0)
  }

  render() {
    const userLoaded = this.state.user && this.state.user.isOk();
    if (!userLoaded) {
      return 'Cargando..'
    }
    return (
      <React.Fragment>
          <Level>
            <LevelLeft>
              <Title>Editar usuario</Title>
            </LevelLeft>
          </Level>
          <hr />
          <Columns>
            <Column isSize={4} className="pl-4 pr-4 ml-5 mt-3">
              <UsersForm user={ this.state.user } onChange={this.handleChange} />
            </Column>
            <Column isSize={2}></Column>
            <Column isSize={6} clasName="has-text-centeres">
              <SvgDraw style={{ height: '75%', width: '75%' }} />
            </Column>
          </Columns>
          {this.state.isSaving ?
            <Button kind="outline" className="ml-6" disabled pulse icon={faSpinner}>Guardando</Button> :
            <Button kind="outline" className="ml-6" onClick={this.handleSave} disabled={ this.getDisabled() }>Guardar</Button>}
        </React.Fragment>)
  }
}

export default withRouter(withStore(withToastManager(UserEdit)))