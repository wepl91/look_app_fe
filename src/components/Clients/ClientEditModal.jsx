import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

import { withToastManager } from 'react-toast-notifications';
import { withRouter } from 'react-router';
import { withStore } from '../../hocs';

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
  Columns,
  Column
} from 'bloomer';

import { ClientsForm } from './';

import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

@observer
class ClientEditModal extends Component {

  modifiedClient

  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClose  = this.handleClose.bind(this);
    this.handleSave   = this.handleSave.bind(this);
  }

  handleChange( name, value ) {
    const client = this.getClient();
    client[name] = value;
  }

  handleSave() {
    const { toastManager } = this.props;
    const client = this.getClient();
    this.setState({
      isSaving: true,
    }, () => {
      client.save().andThen((savedClient, responseError) => {
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
          toastManager.add("El cliente ha sido modificado exitosamente!", {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
        }
        this.props.onSave && this.props.onSave()
      });
    })
  }

  handleClose() {
    this.props.onClose && this.props.onClose();
  }

  getClient() {
    if (this.modifiedClient) {
      return this.modifiedClient;
    }
    else {
      this.modifiedClient = this.props.client.clone();
      return this.modifiedClient;
    }
  }

  render() {
    const client = this.getClient();
    return(
      <Modal show height="80%">
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>Modificar cliente</Title>
            </LevelLeft>
            <LevelRight>
              <Button kind="link" icon={ faTimes } onClick={ this.handleClose } />
            </LevelRight>
          </Level>
        </ModalHeader>
        <ModalContent>
          <Columns>
            <Column isSize={ 2 }></Column>
            <Column isSize={ 8 }> 
              <ClientsForm client={ client } onChange={ this.handleChange } />
            </Column>
          </Columns>
        </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft></LevelLeft>
            <LevelRight>
              { this.state.isSaving ? 
                <Button kind="outline" disabled pulse icon={ faSpinner }>Guardando..</Button> :
                <Button kind="outline" onClick={ this.handleSave } >Guardar</Button> }
              <Button kind="link" onClick={ this.handleClose }>Cancelar</Button>
            </LevelRight>
          </Level>
        </ModalFooter>
      </Modal> )
  }
}

ClientEditModal.PropTypes = {
  client: PropTypes.object,
  onClose: PropTypes.func,
  onSave: PropTypes.func
}

ClientEditModal.defaultProps = {
  client: null,
  onClose: null,
  onSave: null,
}

export default withToastManager(withRouter(withStore(ClientEditModal)));