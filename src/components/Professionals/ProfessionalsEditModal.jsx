import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ProfessionalsForm } from './';

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


class ProfessionalsEditModal extends Component {
  
  modifiedProfessional
  
  constructor(props) {
    super(props);

    this.handleSave   = this.handleSave.bind(this);
    this.handleClose  = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      reload: true,
      validServices: true,
      validHours: true
    }
  }

  handleSave() {
    const { toastManager } = this.props;
    const professional = this.getProfessional();
    professional.status = 'ACTIVE';
    
    professional.save().andThen( (savedProfessional, responseError) => {
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
    const professional = this.getProfessional();
    if(name == 'services'){
      this.setState({
        validServices: valid,
      })
    }
    if(name == 'hours'){
      professional.startingTime = value[0],
      professional.finishingTime = value[1],
      this.setState({
        validHours: valid,
      })
    }else{
      professional[name] = value;
      this.setState( prevState => ({
        reload: !prevState.reload
      }))
    }
  }

  getProfessional() {
    if (this.modifiedProfessional) {
      return this.modifiedProfessional;
    }
    else {
      this.modifiedProfessional = this.props.professional.clone();
      return this.modifiedProfessional;
    }
  }

  getDisabled() {
    const professional = this.getProfessional();
    if (!this.state.validServices || !this.state.validHours) {
      return true;
    }
    if (professional.name == '') {
      return true;
    }

    return false;
  }

  render() {
    const professional = this.getProfessional()
    return(
      <Modal show>
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>Modificar profesional</Title>
            </LevelLeft>
            <LevelRight>
              <Button kind="link" icon={ faTimes } onClick={ this.handleClose } />
            </LevelRight>
          </Level>
        </ModalHeader>
        <ModalContent>
          <ProfessionalsForm onChange={ this.handleChange } professional={ professional } />
        </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft></LevelLeft>
            <LevelRight>
              <Button disabled={ this.getDisabled() } onClick={ this.handleSave }>Guardar</Button>
              <Button kind="outline" onClick={ this.handleClose }>Cancelar</Button>
            </LevelRight>
          </Level>
        </ModalFooter>
      </Modal> )
  }
}

ProfessionalsEditModal.PropTypes = {
  professional: PropTypes.object,
  onClose: PropTypes.function,
}

ProfessionalsEditModal.defaultProps = {
  professional: null,
  onClose: null,
}

export default withToastManager(ProfessionalsEditModal)