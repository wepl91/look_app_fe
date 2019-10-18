import React, { Component } from 'react';

import withStore from '../../hocs/withStore';
import { withToastManager } from 'react-toast-notifications';

import { observer } from 'mobx-react';

import startCase from 'lodash/startCase';

import { faSpinner, faChild, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import {
  Loader,
  Title,
  Text,
  Table,
  Button,
  SelectableIcon,
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight
} from 'bloomer';

import { ClientEditModal } from '../../components/Clients';

@observer
class ClientsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: null,
      showModal: false,
    }
    
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.setState({
      clients: this.props.store.clients.search({}, 'client-list-view', true),
    });    
  }

  handleSave() {
    this.setState({
      showModal: false,
      clients: this.props.store.clients.search({}, 'client-list-view', true),
    });   
  }

  handleCloseModal() {
    this.setState({
      client: null,
      showModal: false,
    })
  }

  handleShowModal( client ) {
    this.setState({
      showModal: true,
      client: client,
    })
  }

  renderTable() {
    const data = this.state.clients.toArray();

    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faChild } readOnly/>),
        size: 'is-1',
      },
      {
        label: 'Nombre',
        content: (data) => (<Text>{ startCase( data.fullName) || '- sin nombre -' }</Text>),
        size: 'is-2'
      },
      {
        label: 'Teléfono principal',
        content: (data) => (<Text>{ data.primaryPhone || '- sin teléfono -' }</Text>),
        size: 'is-2'
      },
      {
        label: 'Teléfono secundario',
        content: (data) => (<Text>{ data.secondPhone || '- sin teléfono -' }</Text>),
        size: 'is-2'
      },
      {
        label: 'DNI',
        content: (data) => (<Text>{ `${ data.DNI || '- sin DNI -' }` }</Text>),
        size: 'is-2',
      },
      {
        label: 'Categoría',
        content: (data) => (<Text>{ `${ data.category }` }</Text>),
        size: 'is-2',
      },
      {
        label: '',
        content: (data) => (<Button icon={ faPencilAlt } kind="link" onClick={ () => (this.handleShowModal(data)) } />),
        size: 'is-1',
        align: 'center'
      },
    ]

    return <Table columns={ columns } data={ data } striped={ false }/>
  }

  renderModal() {
    return <ClientEditModal client={ this.state.client } onClose={ this.handleCloseModal } onSave={ this.handleSave }/>;
  }
  
  render() {
    const isClientsLoaded = this.state.clients && this.state.clients.isOk();
    if (!isClientsLoaded) {
      return <Loader icon={ faSpinner } label="Cargando los clientes.." className="fullscreen" />
    }
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Listado de Clientes</Title>
          </LevelLeft>
        </Level>
        <hr/>
        { this.renderTable() }
        { this.state.showModal && this.renderModal() }
      </React.Fragment> )
  }
}

export default withToastManager(withStore(ClientsList));