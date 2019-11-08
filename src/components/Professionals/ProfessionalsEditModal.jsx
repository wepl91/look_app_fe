import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ProfessionalsForm } from './';

import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { withToastManager } from 'react-toast-notifications';

import { observer } from 'mobx-react';

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

@observer
class ProfessionalsEditModal extends Component {
  
  modifiedProfessional
  
  constructor(props) {
    super(props);

    this.handleSave   = this.handleSave.bind(this);
    this.handleClose  = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      reload: true,
      validName: true,
      validLastName: true,
      validPhone: true,
      validMail: true,
      validServices: true,
      validHours: true,
    }
  }

  handleSave() {
    const { toastManager } = this.props;
    const professional = this.getProfessional();
    
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
    else if(name=='phone'){
      this.setState({
        validPhone: valid.type == 'success',
      })
    } 
    else if(name=='email'){
      this.setState({
        validMail: valid.type == 'success',
      })
    } 
    else if(name == 'services'){
      this.setState({
        validServices: valid,
      })
    } 
    if(name == 'hours'){
      professional.workingHours = value
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
    return !(this.state.validName && this.state.validLastName && this.state.validPhone && this.state.validMail && this.state.validServices && this.state.validHours)
  }
  
  render() {
    const professional = this.getProfessional()
    return(
      <Modal show width="50%">
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
              <Button kind="outline" disabled={ this.getDisabled() } onClick={ this.handleSave }>Guardar</Button>
              <Button kind="link" onClick={ this.handleClose }>Cancelar</Button>
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