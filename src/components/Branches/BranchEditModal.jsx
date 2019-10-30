import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

import { withToastManager } from 'react-toast-notifications';
import { withRouter } from 'react-router';
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
  Columns,
  Column
} from 'bloomer';

import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { BranchesForm } from './';

import { translate } from '../../lib/Translator';

@observer
class BranchEditModal extends Component {

  modifiedBranch

  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClose  = this.handleClose.bind(this);
    this.handleSave   = this.handleSave.bind(this);
  }

  handleChange( name, value, valid ) {

  }

  handleSave() {

  }

  handleClose() {
    this.props.onClose && this.props.onClose();
  }
  
  getBranch() {
    if (this.modifiedBranch) {
      return this.modifiedBranch;
    }
    else {
      this.modifiedBranch = this.props.branch.clone();
      return this.modifiedBranch;
    }
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  getDisabled() {
    return !this.modifiedBranch.name || !this.modifiedBranch.street_name || !this.modifiedBranch.street_number || !this.modifiedBranch.location;
  }
  
  render() {
    const branch = this.getBranch();
    return(
      <Modal show height="80%" width="75%">
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>{ this.getText('Modificar sucursal') }</Title>
            </LevelLeft>
            <LevelRight>
              <Button kind="link" icon={ faTimes } onClick={ this.handleClose } />
            </LevelRight>
          </Level>
        </ModalHeader>
        <ModalContent>
          <Columns>
            <Column> 
              <br />
              <BranchesForm branch={ branch } onChange={ this.handleChange } withMap/>
            </Column>
          </Columns>
        </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft></LevelLeft>
            <LevelRight>
              { this.state.isSaving ? 
                <Button kind="outline" disabled pulse icon={ faSpinner }>{ this.getText('Guardando..') }</Button> :
                <Button kind="outline" onClick={ this.handleSave } disabled={ this.getDisabled() }>{ this.getText('Guardar') }</Button> }
              <Button kind="link" onClick={ this.handleClose }>Cancelar</Button>
            </LevelRight>
          </Level>
        </ModalFooter>
      </Modal> )
  }
}

BranchEditModal.PropTypes = {
  branch: PropTypes.object,
  onClose: PropTypes.func,
  onSave: PropTypes.func
}

BranchEditModal.defaultProps = {
  branch: null,
  onClose: null,
  onSave: null,
}

export default withToastManager(withRouter(withStore(BranchEditModal)));