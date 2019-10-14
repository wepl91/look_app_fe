import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
  Title
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight,
} from 'bloomer';

class ConfirmationModal extends Component {
  constructor(props) {
    super(props);

    this.handleAccept = this.handleAccept.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleAccept() {
    this.props.onAccept && this.props.onAccept();
  }

  handleCancel() {
    this.props.onCancel && this.props.onCancel();
  }

  render() {
    return(
      <Modal show>
        <ModalHeader>
          <Title>{ this.props.title || 'Aviso'}</Title>
        </ModalHeader>
        <ModalContent>
         { this.props.content }
        </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft></LevelLeft>
            <LevelRight>
              <Button onClick={ this.handleAccept } kind="outline">Aceptar</Button>
              <Button onClick={ this.handleCancel } kind="link">Cancelar</Button>
            </LevelRight>
          </Level>
        </ModalFooter>
      </Modal> )
  }
}

ConfirmationModal.PropTypes = {
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.object, PropTypes.node, PropTypes.any]),
  onAccept: PropTypes.func,
  onCancel: PropTypes.func,
}

ConfirmationModal.defaultProps = {
  title: null,
  content: null,
  onAccept: null,
  onCancel: null
} 

export default ConfirmationModal