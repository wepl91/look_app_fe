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
import { withToastManager } from 'react-toast-notifications';

import { observer } from 'mobx-react';

import { faSuitcase, faPencilAlt, faSpinner } from "@fortawesome/free-solid-svg-icons";

import startCase from 'lodash/startCase';

import { UsersEditModal } from '../../components/Users';

import { ConfirmationModal } from '../../components/ConfirmationModal';

@observer
class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
      showModal: false,
      editUser: null,
      showToggleConfirmation: false,
      toggle: null,
      user: null,
    }

    this.handleHideModal  = this.handleHideModal.bind(this);
    this.handleToggle     = this.handleToggle.bind(this);
    this.handleSaved      = this.handleSaved.bind(this);
    this.handleActivate   = this.handleActivate.bind(this);
    this.handleInactivate = this.handleInactivate.bind(this);
  }

  handleToggle( user ) {
    this.setState({
      showToggleConfirmation: true,
      toggle: user.isActive ? 'inactive' : 'active',
      user: user
    });
  }

  handleActivate() {
    const { user } = this.state;
    const { toastManager } = this.props;
    user.activate().andThen( (savedUser, responseError) => {
      if (responseError) {
        toastManager.add("Ups! Parece que hubo un error al activar el usuario!", {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
        this.setState({
          showToggleConfirmation: false,
        });
      }
      else {
        toastManager.add("El usuario ha sido activado exitosamente!", {
          appearance: 'success',
          autoDismiss: true,
          pauseOnHover: false,
        });
        this.setState({
          users: this.props.store.users.search({}, 'users-list-view', true),
          showToggleConfirmation: false
        });
      }
    })
  }

  handleInactivate() {
    const { user } = this.state;
    const { toastManager } = this.props;
    user.deactivate().andThen( (savedUser, responseError) => {
      if (responseError) {
        toastManager.add("Ups! Parece que hubo un error al desactivar el usuario!", {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
        this.setState({
          showToggleConfirmation: false,
        });
      }
      else {
        toastManager.add("El usuario ha sido desactivado exitosamente!", {
          appearance: 'success',
          autoDismiss: true,
          pauseOnHover: false,
        });
        this.setState({
          users: this.props.store.users.search({}, 'users-list-view', true),
          showToggleConfirmation: false
        });
      }
    })
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
        content: (data) => (<Toggle key={ this.state } checked={ data.isActive } checkedColor="success" unCheckedColor="delete" onChange={ () => (this.handleToggle(data)) }/>),
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
    return( <UsersEditModal user={ this.state.editUser } onClose={ this.handleHideModal } onSave={ this.handleSaved }/> )
  }

  renderConfirmationModal() {
    const { user } = this.state;
    return( 
      <ConfirmationModal 
        title={ user.isActive ? 'Inactivar usuario' : 'Activar usuario' }
        content={ user.isActive ? `¿Estás seguro de querer inactivar el ususario ${ user.cookedFullName }?` : `¿Estás seguro de querer activar el ususario ${ user.cookedFullName }?` }
        onAccept={ user.isActive ? this.handleInactivate : this.handleActivate }
        onCancel={ () => ( this.setState({ showToggleConfirmation: false, toggle: null, user: null }) ) } /> )
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
        { this.state.showToggleConfirmation && this.renderConfirmationModal() }
      </React.Fragment> )
  }

}

export default withToastManager(withStore(UsersList));