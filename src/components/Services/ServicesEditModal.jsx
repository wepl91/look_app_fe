import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ServicesForm } from './';

import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { withToastManager } from 'react-toast-notifications';

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

class ServicesEditModal extends Component {
  
  modifiedService
  
  constructor(props) {
    super(props);

    this.handleSave   = this.handleSave.bind(this);
    this.handleClose  = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      buttonDisabled: false,
      reload: true,
    }
  }

  handleSave() {
    const { toastManager } = this.props;
    const service = this.getService();
    service.name = this.state.name;
    service.price = this.state.price;
    service.duration = this.state.duration;
    
    service.save().andThen( (savedService, responseError) => {
      if (responseError) {
        toastManager.add("Ups! Parece que hubo un error al guardar los cambios!", {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
        this.handleClose();
      }
      else {
        toastManager.add("Los cambios se han guardado exitosamente!", {
          appearance: 'success',
          autoDismiss: true,
          pauseOnHover: false,
        });
        this.handleClose();
      }
    })
  }

  handleClose() {
    this.props.onClose && this.props.onClose();
  }

  handleChange( name, value, valid ) {
    const service = this.getService();
    if (name == 'cost') {
      service.price = value
      this.setState({
        buttonDisabled: valid.type == 'error',
      })
    }
    else {
      service[name] = value;
      this.setState( prevState => ({
        reload: !prevState.reload
      }))
    } 
  }

  getService() {
    if (this.modifiedService) {
      return this.modifiedService;
    }
    else {
      this.modifiedService = this.props.service.clone();
      return this.modifiedService;
    }
  }

  getDisabled() {
    const service = this.getService();
    if (this.state.buttonDisabled) {
      return false;
    }

    if (service.price == '' || service.duration == '' || service.name == '') {
      return false;
    }

    return true;
  }

  render() {
    const service = this.getService()
    return(
      <Modal show>
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>Modificar turno</Title>
            </LevelLeft>
            <LevelRight>
              <Button kind="link" icon={ faTimes } onClick={ this.handleClose } />
            </LevelRight>
          </Level>
        </ModalHeader>
        <ModalContent>
          <ServicesForm onChange={ this.handleChange } service={ service }/>
        </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft></LevelLeft>
            <LevelRight>
              <Button disabled={ !this.getDisabled() } onClick={ this.handleSave }>Guardar</Button>
              <Button kind="outline" onClick={ this.handleClose }>Cancelar</Button>
            </LevelRight>
          </Level>
        </ModalFooter>
      </Modal> )
  }
}

ServicesEditModal.PropTypes = {
  service: PropTypes.object,
  onClose: PropTypes.function,
}

ServicesEditModal.defaultProps = {
  service: null,
  onClose: null,
}

export default withToastManager(ServicesEditModal)