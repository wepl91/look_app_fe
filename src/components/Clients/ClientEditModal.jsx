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
      validName: true,
      validLastName: true,
      validDni: true,
      validEmail: true,
      validPrimaryPhone: true,
      validSecondaryPhone: true
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClose  = this.handleClose.bind(this);
    this.handleSave   = this.handleSave.bind(this);
  }

  handleChange( name, value, valid ) {
    const client = this.getClient();
    client[name] = value;
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
    else if(name=='DNI'){
      this.setState({
        validDni: valid.type == 'success',
      })
    }
    else if(name=='primaryPhone'){
      this.setState({
        validPrimaryPhone: valid.type == 'success',
      })
    } 
    else if(name=='secondPhone'){
      this.setState({
        validSecondaryPhone: valid.type == 'success',
      })
    }
    else if(name=='email'){
      this.setState({
        validEmail: valid.type == 'success',
      })
    }
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

  getDisabled() {
    return !(this.state.validName && this.state.validLastName && this.state.validDni && this.state.validPrimaryPhone && this.state.validSecondaryPhone && this.state.validEmail)
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
            <Column isSize={ 1 }></Column>
            <Column isSize={ 10 }> 
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
                <Button kind="outline" onClick={ this.handleSave } disabled={ this.getDisabled() }>Guardar</Button> }
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