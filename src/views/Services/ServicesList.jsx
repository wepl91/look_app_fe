import React, { Component } from 'react';

import {
  Title,
  Button,
} from 'shipnow-mercurio';

import {
  Columns,
  Column,
  Level,
  LevelLeft,
  LevelRight
} from 'bloomer';

import { ServiceCreationModal } from '../../components/Services';

class ServicesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreationModal: false,
    }

    this.handleModal = this.handleModal.bind(this);
  }

  handleModal() {
    this.setState(prevState => ({
      showCreationModal: !prevState.showCreationModal,
    }))
  }

  render() {
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Lista de servicios</Title>
          </LevelLeft>
          <LevelRight>
            <Button kind="outline" onClick={ this.handleModal }>Crear servicio</Button>
          </LevelRight>
        </Level>
        { this.state.showCreationModal && <ServiceCreationModal onClose={ this.handleModal }/> }
      </React.Fragment> )
  }

}

export default ServicesList;