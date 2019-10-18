import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withToastManager } from 'react-toast-notifications';
import { withRouter } from 'react-router';
import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Title,
  Button,
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight,
} from 'bloomer';

import { UsersForm } from './';

@observer
class UsersEditModal extends Component {
  
  modifiedUser

  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      validName: true,
      validLastName: true,
      validMail: true,
    }

    this.handleSave   = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose  = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.onClose && this.props.onClose();
  }

  handleSave() {
    const { toastManager } = this.props;
    const user = this.getUser();
    user.fullName = `${user.name} ${user.lastname}`;
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
          toastManager.add("El usuario ha sido modificado exitosamente!", {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
        }
        this.props.onSave && this.props.onSave()
      });
    })
  }

  handleChange(name, value, valid) {
    const user = this.getUser();
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
  }

  getDisabled() {
    return !(this.state.validName && this.state.validLastName && this.state.validMail && this.modifiedUser.roles.length > 0)
  }

  getUser() {
    if (this.modifiedUser) {
      return this.modifiedUser;
    }
    else {
      this.modifiedUser = this.props.user.clone();
      return this.modifiedUser;
    }
  }
  
  render() {
    const user = this.getUser()
    return(
      <Modal show height="70%">
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>Modificar usuario</Title>
            </LevelLeft>
            <LevelRight>
              <Button kind="link" icon={ faTimes } onClick={ this.handleClose } />
            </LevelRight>
          </Level>
        </ModalHeader>
        <ModalContent>
          <UsersForm user={ user } onChange={ this.handleChange } />
        </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft></LevelLeft>
            <LevelRight>
              { this.state.isSaving ? 
                <Button kind="outline" disabled pulse icon={ faSpinner }>Guardando..</Button> :
                <Button kind="outline" onClick={ this.handleSave } disabled={ this.getDisabled() }>Guardar</Button> }
              <Button kind="link" onClick={ this.handleClose }>Cancelar</Button>
            </LevelRight>
          </Level>
        </ModalFooter>
      </Modal> )
  }
}

UsersEditModal.PropTypes = {
  user: PropTypes.object,
  onClose: PropTypes.func,
  onSave: PropTypes.func
}

UsersEditModal.defaultProps = {
  user: null,
  onClose: null,
  onSave: null,
}

export default withToastManager(withRouter(withStore(UsersEditModal)));