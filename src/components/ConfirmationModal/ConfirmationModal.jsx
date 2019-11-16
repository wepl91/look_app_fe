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
              { this.props.onAccept && <Button onClick={ this.handleAccept } kind="outline">{ this.props.acceptWording }</Button> }
              { this.props.onCancel && <Button onClick={ this.handleCancel } kind="link">{ this.props.cancelWording }</Button> }
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
  cancelWording: PropTypes.string,
  acceptWording: PropTypes.string,
}

ConfirmationModal.defaultProps = {
  title: null,
  content: null,
  onAccept: null,
  onCancel: null,
  cancelWording: 'Cancelar',
  acceptWording: 'Aceptar'
} 

export default ConfirmationModal