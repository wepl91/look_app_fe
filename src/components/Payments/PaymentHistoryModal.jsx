import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStore } from '../../hocs';

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  SelectableIcon,
  Title,
  Button,
  Table,
  Text
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight,
  Columns,
  Column
} from 'bloomer';

import { 
  observer 
} from 'mobx-react';

import { 
  translate 
} from '../../lib/Translator';

import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { 
  faTimes,
  faDollarSign
} from "@fortawesome/free-solid-svg-icons";

import moment from 'moment';

@observer
class PaymentHistoryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appointment: props.appointment,
    }

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.onClose && this.props.onClose();
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  renderTable() {
    const data = this.props.appointment.payments;
    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faDollarSign } readOnly/>),
        size: 'is-1',
      },
      {
        label: this.getText('Monto'),
        content: (data) => (<Text>{ data.amount }</Text>),
        size: 'is-2'
      },
      {
        label: this.getText('Fecha de pago'),
        content: (data) => (<Text>{ moment(data.dateCreated).format('DD-MM-YYYY HH:mm') }</Text>),
        size: 'is-2'
      },
    ];
    return <Table columns={ columns } data={ data } striped={ false }/>
  }

  render() {
    return(
      <Modal show>
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>{ this.getText('Historial de pagos') }</Title>
            </LevelLeft>
            <LevelRight>
              <Button icon="plus" kind="link" size="xl" onClick={ this.handleClose }>
                <FontAwesomeIcon icon={ faTimes }/>
              </Button>
            </LevelRight>
          </Level>
        </ModalHeader>
        <ModalContent>
          { this.renderTable() }
        </ModalContent>
        <ModalFooter>
        </ModalFooter>
      </Modal> );
  }
}

PaymentHistoryModal.PropTypes = {
  appointment: PropTypes.object,
  onClose: PropTypes.func,
}

PaymentHistoryModal.defaultProps = {
  appointment: null,
  onClose: null,
}

export default withStore(PaymentHistoryModal);