import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
  Select,
  Field,
  TextInput,
  Title
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight,
  Column,
  Columns
} from 'bloomer'

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

class ServiceCreationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      price: '',
      buttonDisabled: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange( sender, value, name, valid ) {
    if (name == 'price') {
      this.setState({
        price: value,
        buttonDisabled: valid.type == 'error',
      })
    }
  }

  handleClose() {
    this.props.onClose && this.props.onClose();
  }

  render() {
    const priceRegex = /[a-zA-Z]/;
    return(
      <Modal show>
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>Nuevo servicio</Title>
            </LevelLeft>
            <LevelRight>
              <Button icon="plus" kind="link" size="xl" onClick={ this.handleClose }>
              <FontAwesomeIcon icon={ faTimes }/>
            </Button>
            </LevelRight>
          </Level>
        </ModalHeader>
        <ModalContent>
          <Field className="pl-5 pr-5" label="¿En cual sucursal querés ofrecer este servicio">
            <Select className="is-fullwidth" />
          </Field>
          <Field className="pl-5 pr-5" label="¿Como se llama el servicio que querés ofrecer?">
            <TextInput className="is-fullwidth" />
          </Field>
          <Field className="pl-5 pr-5" label="¿Cuanto deseas cobrar por el servicio">
            <TextInput className="is-fullwidth"
              value={ this.state.price } 
              validate={ (value) => (!priceRegex.test(value)) } name="price" onChange={ this.handleChange }/>
          </Field>
        </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft></LevelLeft>
            <LevelRight>
              <Button kind="outline" disabled={ this.state.isSaving || this.state.buttonDisabled }>{ this.state.isSaving ? 'Guardando..' : 'Guardar' }</Button>
            </LevelRight>
          </Level>
        </ModalFooter>
      </Modal>)
  }
}

ServiceCreationModal.PropTypes = {
  onSave: PropTypes.func,
  onClose: PropTypes.func,
}

ServiceCreationModal.defaultProps ={
  onSave: null,
  onClose: null,
}

export default ServiceCreationModal;