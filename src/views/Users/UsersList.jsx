import React, { Component } from 'react';

import {
  Title,
  Table,
  SelectableIcon,
  Text,
  Button,
  Toggle,
  Loader
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft
} from 'bloomer';

import withStore from '../../hocs/withStore';

import { observer } from 'mobx-react';

import { faSuitcase, faPencilAlt, faSpinner } from "@fortawesome/free-solid-svg-icons";

import startCase from 'lodash/startCase';

import { UsersEditModal } from '../../components/Users';

@observer
class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
      showModal: false,
      editUser: null
    }

    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleSaved     = this.handleSaved.bind(this);
  }

  handleShowModal( user ) {
    this.setState({
      editUser: user,
      showModal: true,
    })
  }

  handleHideModal() {
    this.setState({
      editUser: null,
      showModal: false
    })
  }

  handleSaved() {
    this.setState({
      showModal: false,
      users: this.props.store.users.search({}, 'users-list-view', true),
    })
  }

  componentDidMount() {
    this.setState({
      users: this.props.store.users.search({}, 'users-list-view', true),
    })
  }

  renderTable() {
    const data = this.state.users.toArray();

    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faSuitcase } readOnly/>),
        size: 'is-1',
      },
      {
        label: 'Nombre',
        content: (data) => (<Text>{ startCase( data.fullName) || '- sin nombre -' }</Text>),
        size: 'is-2'
      },
      {
        label: 'Mail',
        content: (data) => (<Text>{ data.email || '- sin email -' }</Text>),
        size: 'is-2'
      },
      {
        label: '',
        content: null,
        size: 'is-1',
        align: 'left'
      },
      {
        label: 'Rol',
        content: (data) => (<Text>{ `${ data.userRole }` }</Text>),
        size: 'is-2',
      },{
        label: '',
        content: null,
        size: 'is-1',
        align: 'left'
      },
      {
        label: 'Activo',
        content: (data) => (<Toggle checked={ data.active || true } checkedColor="success" unCheckedColor="delete"/>),
        size: 'is-1',
        align: 'left'
      },
      {
        label: '',
        content: null,
        size: 'is-1',
        align: 'left'
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
    return(<UsersEditModal user={ this.state.editUser } onClose={ this.handleHideModal } onSave={ this.handleSaved }/>)
  }

  render() {
    if (!this.state.users || !this.state.users.isOk()) {
      return <Loader icon={ faSpinner } label="Cargando los usuarios.." className="fullscreen" />
    }
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Lista de Usuarios</Title>
          </LevelLeft>
        </Level>
        <hr/>
        { this.renderTable() }
        { this.state.showModal && this.renderModal() }
      </React.Fragment> )
  }

}

export default withStore(UsersList);