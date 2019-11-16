import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DiscountsForm } from './';

import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { withToastManager } from 'react-toast-notifications';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

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

@observer
class DiscountsEditModal extends Component {
  
  modifiedDiscount
  
  constructor(props) {
    super(props);

    this.handleSave   = this.handleSave.bind(this);
    this.handleClose  = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      reload: true,
      validName: true,
      validDiscount: true,
      validStartingDate: true,
      validEndingDate: true
    }
  }

  handleSave() {
    const { toastManager } = this.props;
    const discount = this.getDiscount().clean();
    
    discount.save().andThen( (savedDiscount, responseError) => {
      if (responseError) {
        toastManager.add(this.getText('Ups! Parece que hubo un error al guardar los cambios!'), {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
        this.handleClose();
      }
      else {
        toastManager.add(this.getText('Los cambios se han guardado exitosamente!'), {
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
    const discount = this.getDiscount();
    if(name=='name'){
      this.setState({
        validName: valid.type == 'success',
      })
    } 
    else if(name=='discount'){
      this.setState({
        validDiscount: valid.type == 'success',
      })
    } 
    else if(name=='multiplier'){
      this.setState({
        validDiscount: valid,
      })
      name = 'discount'
    } 
    else if(name=='startDate'){
      this.setState({
        validStartingDate: valid,
      })
    } 
    else if(name=='endDate'){
      this.setState({
        validEndingDate: valid,
      })
    }
    else if(name=='type'){
      discount['discount'] = ''
    }

    discount[name] = value;
    this.setState( prevState => ({
      reload: !prevState.reload
    }))
  }

  getDiscount() {
    if (this.modifiedDiscount) {
      return this.modifiedDiscount;
    }
    else {
      this.modifiedDiscount = this.props.discount.clone();
      return this.modifiedDiscount;
    }
  }

  getDisabled() {
    return !(this.state.validName && this.state.validDiscount && this.state.validStartingDate && this.state.validEndingDate && this.modifiedDiscount.services.length > 0)
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }
  
  render() {
    const discount = this.getDiscount()
    return(
      <Modal show width="50%">
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>{this.getText('Modificar promoción')}</Title>
            </LevelLeft>
            <LevelRight>
              <Button kind="link" icon={ faTimes } onClick={ this.handleClose } />
            </LevelRight>
          </Level>
        </ModalHeader>
        <ModalContent>
          <DiscountsForm onChange={ this.handleChange } discount={ discount } />
        </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft></LevelLeft>
            <LevelRight>
              <Button kind="outline" disabled={ this.getDisabled() } onClick={ this.handleSave }>{this.getText('Guardar')}</Button>
              <Button kind="link" onClick={ this.handleClose }>{this.getText('Cancelar')}</Button>
            </LevelRight>
          </Level>
        </ModalFooter>
      </Modal> )
  }
}

DiscountsEditModal.PropTypes = {
  discount: PropTypes.object,
  onClose: PropTypes.function,
}

DiscountsEditModal.defaultProps = {
  discount: null,
  onClose: null,
}

export default withToastManager(withStore(DiscountsEditModal))

