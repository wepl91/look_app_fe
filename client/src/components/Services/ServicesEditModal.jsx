import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ServicesForm } from './';

import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { withToastManager } from 'react-toast-notifications';
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
} from 'bloomer';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

@observer
class ServicesEditModal extends Component {
  
  modifiedService
  
  constructor(props) {
    super(props);

    this.handleSave   = this.handleSave.bind(this);
    this.handleClose  = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      validName: true,
      validPrice: true,
      reload: true,
    }
  }

  handleSave() {
    const { toastManager } = this.props;
    const service = this.getService();

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
    if(name=='name'){
      this.setState({
        validName: valid.type == 'success',
      })
    }
    if (name == 'cost') {
      service.price = value
      this.setState({
        validPrice: valid.type == 'success',
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
    return !(this.state.validName && this.state.validPrice)
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const service = this.getService()
    return(
      <Modal show>
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>{ this.getText('Modificar servicio') }</Title>
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
              <Button disabled={ this.getDisabled() } onClick={ this.handleSave }>{ this.getText('Guardar') }</Button>
              <Button kind="outline" onClick={ this.handleClose }>{ this.getText('Cancelar') }</Button>
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

export default withToastManager(withStore(ServicesEditModal))