import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Title,
  Text,
  Button,
  Table,
  Select,
  Field
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight,
  Columns,
  Column
} from 'bloomer';

import { faDownload, faEnvelopeOpenText, faTimes, faCalendarAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { ReactComponent as SvgDraw } from '../../assets/undraw_jewelry_iima.svg';

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
    return(
      <Columns>
        <Column isSize={ 6 }>
          <Field label="¿A cual de nuestras sucursales querés venir?" labelNote="Seleccioná una sucursal">
            <Select />
          </Field>
          <Field label="¿Por quién querés ser atendido?" labelNote="Seleccioná un profesional">
            <Select />
          </Field>
          <Field label="¿A que hora querés venir?" labelNote="Seleccioná un horario">
            <Select />
          </Field>
        </Column>
        <Column className="has-text-centered">
          <SvgDraw style={{ height: '300px', width: '300px' }}/>
        </Column>
      </Columns> )
  }

  renderList() {
    const columns = [
      {
       label: 'Cliente',
       content: (data) => (<Text>{ data.name }</Text>),
       size: 'is-2',
      },
      {
        label: 'Horario',
        content: (data) => (<Text>{ `${ data.hour } hs` }</Text>),
        size: 'is-2'
      },
      {
        label: 'Comprobante reserva',
        content: (data) =>(
          <Columns className="has-text-left">
              <Button className="ml-1" kind="link">
                <FontAwesomeIcon icon={ faEnvelopeOpenText }/>
              </Button>
              <Button kind="link">
                <FontAwesomeIcon icon={ faDownload }/>
              </Button>
          </Columns> )
      },
      {
        label: 'Comprobante cancelación',
        content: (data) =>(
          <Columns className="has-text-left">
            <Button className="ml-1" kind="link">
              <FontAwesomeIcon icon={ faEnvelopeOpenText }/>
            </Button>
            <Button kind="link">
              <FontAwesomeIcon icon={ faDownload }/>
            </Button>
          </Columns> )
      },
      {
        label: 'Comprobante pago',
        content: (data) =>(
          <Columns className="has-text-left">
            <Button className="ml-1" kind="link">
              <FontAwesomeIcon icon={ faEnvelopeOpenText }/>
            </Button>
            <Button kind="link">
              <FontAwesomeIcon icon={ faDownload }/>
            </Button>
          </Columns> )
      },
      {
        label: 'Acción',
        content: (data) => (<Button kind="outline"><FontAwesomeIcon className="mr-1" icon={ faTrash }/> Cancelar</Button>)
      }

    ]

    return(<Table columns={ columns } data={ this.props.appointments } striped={ false }/>)
  }

  render() {
    const { date } = this.props
    return(
      <Modal width="70%" show>
        <ModalHeader>
          <Level>
            <LevelLeft>
              <Title>{ this.state.renderCreate ? 'Nuevo turno' : `${ moment(date).format('LL') }` }</Title>
            </LevelLeft>
            <LevelRight>
            <Button icon="plus" kind="link" size="xl" onClick={ this.handleClose }>
              <FontAwesomeIcon icon={ faTimes }/>
            </Button>
            </LevelRight>
            </Level>
        </ModalHeader>
        <ModalContent>
          { this.state.renderCreate ? this.renderCreate() : this.renderList() }
        </ModalContent>
        <ModalFooter>
          <Level>
            <LevelLeft>{ this.state.renderCreate && <Button kind="outline">Reservar turno</Button> }</LevelLeft>
            <LevelLeft>
              <Button kind="link" onClick={ () => (this.setState(prevState => ({ renderCreate: !prevState.renderCreate }))) }>
                <FontAwesomeIcon className="mr-2" icon={ faCalendarAlt }/>
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
  appointments: PropTypes.array
}

AppointmentModal.defaultProps = {
  date: null,
  onClose: null,
  appointments: []
}

export default AppointmentModal;