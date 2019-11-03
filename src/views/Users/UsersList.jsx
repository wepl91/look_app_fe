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

import { translate } from '../../lib/Translator';

@observer
class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
      showModal: false,
      editUser: null,
    }

    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleSaved = this.handleSaved.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.handleInactivate = this.handleInactivate.bind(this);
  }

  handleActivate(user) {
    const { toastManager } = this.props;
    user.activate().andThen((savedUser, responseError) => {
      if (responseError) {
        toastManager.add(this.getText("Ups! Parece que hubo un error al activar el usuario!"), {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
      else {
        let text = <Text color="warning" weight="medium" className="mt-1 mb-1">{this.getText("¡El usuario ha sido marcado como activo!")}</Text>
        toastManager.add(text, {
          appearance: 'warning',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
    })
  }

  handleInactivate(user) {
    const { toastManager } = this.props;
    user.deactivate().andThen((savedUser, responseError) => {
      if (responseError) {
        toastManager.add(this.getText("Ups! Parece que hubo un error al desactivar el usuario!"), {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
      else {
        let text = <Text color="warning" weight="medium" className="mt-1 mb-1">{this.getText("¡El usuario ha sido marcado como inactivo!")}</Text>
        toastManager.add(text, {
          appearance: 'warning',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
    })
  }

  handleShowModal(user) {
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

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  renderTable() {
    const data = this.state.users.toArray();
    debugger
    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon className="ml-2" icon={faSuitcase} readOnly />),
        size: 'is-1',
      },
      {
        label: this.getText('Nombre'),
        content: (data) => (<Text>{startCase(data.cookedFullName) || this.getText('- sin nombre -')}</Text>),
        size: 'is-2'
      },
      {
        label: this.getText('Mail'),
        content: (data) => (<Text>{data.email || this.getText('- sin email -')}</Text>),
        size: 'is-2'
      },
      {
        label: '',
        content: null,
        size: 'is-1',
        align: 'left'
      },
      {
        label: this.getText('Rol'),
        content: (data) => (<Text>{`${this.getText(data.userRole)}`}</Text>),
        size: 'is-2',
      },
      {
        label: this.getText('Sucursal'),
        content: (data) => (<Text>{data.branch ? `${data.branch.name || data.branch.cookedAddress}` : '- sin sucursal -'}</Text>),
        size: 'is-2',
      },
      {
        label: '',
        content: null,
        size: 'is-1',
        align: 'left'
      },
      {
        label: this.getText('Activo'),
        content: (data) => (<Toggle checked={data.isActive} checkedColor="success" unCheckedColor="delete" onChange={() => (data.isActive ? this.handleInactivate(data) : this.handleActivate(data))} />),
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
        content: (data) => (<Button icon={faPencilAlt} kind="link" onClick={() => (this.handleShowModal(data))} />),
        size: 'is-1',
        align: 'right'
      },
    ]

    return <Table columns={columns} data={data} striped={false} />
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  renderModal() {
    return (<UsersEditModal user={this.state.editUser} onClose={this.handleHideModal} onSave={this.handleSaved} />)
  }

  render() {
    if (!this.state.users || !this.state.users.isOk()) {
      return <Loader icon={faSpinner} label={this.getText("Cargando los usuarios..")} className="fullscreen" />
    }
    return (
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{this.getText("Lista de Usuarios")}</Title>
          </LevelLeft>
        </Level>
        <hr />
        {this.renderTable()}
        {this.state.showModal && this.renderModal()}
        {this.state.showToggleConfirmation && this.renderConfirmationModal()}
      </React.Fragment>)
  }

}

export default withToastManager(withStore(UsersList));