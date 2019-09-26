import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Title,
  Button,
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight
} from 'bloomer';

class AppointmentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderCreate: false
    }
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.onClose && this.props.onClose()
  }

  renderCreate() {

  }

  renderList() {

  }

  render() {
    const { date } = this.props
    return(
      <Modal show>
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>{ this.state.renderCreate ? 'Nuevo turno' : `${ moment(date).format('LL') }` }</Title>
            </LevelLeft>
            <LevelRight>
              <Button icon="plus" kind="link" onClick={ this.handleClose }>Cerrar</Button>
            </LevelRight>
            </Level>
        </ModalHeader>
        <ModalContent>
          { this.state.renderCreate ? this.renderCreate() : this.renderList() }
        </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft></LevelLeft>
            <LevelLeft>
              <Button kind="link" onClick={ () => (this.setState(prevState => ({ renderCreate: !prevState.renderCreate }))) }>
                { this.state.renderCreate ? 'Ver los turnos de hoy' : 'Crear un turno para hoy' }
              </Button>
            </LevelLeft>
          </Level>
        </ModalFooter>
      </Modal> )
  }
}
AppointmentModal.PropTypes = {
  date: PropTypes.object,
  onClose: PropTypes.func,
}

AppointmentModal.defaultProps = {
  date: null,
  onClose: null
}

export default AppointmentModal;