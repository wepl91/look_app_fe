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
    }
  }

  handleSave() {
    const { toastManager } = this.props;
    const service = this.getService();
    service.name = this.state.name;
    service.cost = this.state.cost;
    service.duration = this.state.duration;
    
    service.save().andThen( (savedService, responseError) => {
      if (responseError) {

      }
      else {
        toastManager.add("Los cambios se han guardado exitosamente!", {
          appearance: 'success',
          autoDismiss: true,
          pauseOnHover: false,
        })
        this.handleClose();
      }
    })
  }

  handleClose() {
    this.props.onClose && this.props.onClose();
  }

  handleChange( name, value, valid ) {
    if (name == 'cost') {
      this.setState({
        cost: value,
        buttonDisabled: valid.type == 'error',
      })
    }
    else {
      this.setState({
        [name]: value,
      })
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
              <Button kind="outline" icon={ faTimes } onClick={ this.handleClose } />
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
              <Button disabled={ this.state.buttonDisabled } onClick={ this.handleSave }>Guardar</Button>
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