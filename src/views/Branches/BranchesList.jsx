import React, { Component } from 'react';

import withStore from '../../hocs/withStore';
import { withToastManager } from 'react-toast-notifications';

import { observer } from 'mobx-react';

import startCase from 'lodash/startCase';

import {
  Loader,
  Title,
  Text,
  Table,
  Button,
  SelectableIcon,
  Toggle,
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight
} from 'bloomer';

import { translate } from '../../lib/Translator';

import { faSpinner, faStoreAlt, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import { BranchEditModal } from '../../components/Branches';

@observer
class BranchesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      branches: null,
      showModal: false,
      branch: null,
    }

    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      branches: this.props.store.branches.search({}, 'branches-list', true),
    })
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  handleCloseModal() {
    this.setState({
      showModal: false,
    })
  }

  handleShowModal( branch ) {
    this.setState({
      branch: branch,
      showModal: true
    })
  }

  handleActivate(branch) {
    const { toastManager } = this.props;
    branch.activate().andThen((savedBranch, responseError) => {
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

  handleInactivate(branch) {
    const { toastManager } = this.props;
    branch.deactivate().andThen((savedBranch, responseError) => {
      if (responseError) {
        toastManager.add(this.getText("Ups! Parece que hubo un error al desactivar la sucursal!"), {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
      else {
        let text = <Text color="warning" weight="medium" className="mt-1 mb-1">{this.getText("¡La sucursal ha sido marcado como inactiva!")}</Text>
        toastManager.add(text, {
          appearance: 'warning',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
    })
  }

  renderTable() {
    const data = this.state.branches.toArray();

    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faStoreAlt } readOnly/>),
        size: 'is-1',
      },
      {
        label: this.getText('Nombre'),
        content: (data) => (<Text>{ startCase( data.name) || this.getText('- sin nombre -') }</Text>),
        size: 'is-4'
      },
      {
        label: this.getText('Dirección'),
        content: (data) => (<Text>{ data.cookedAddress || this.getText('- sin dirección -') }</Text>),
        size: 'is-3'
      },
      {
        label: this.getText('Activo'),
        content: (data) => (<Toggle checked={data.isActive} checkedColor="success" unCheckedColor="delete" onChange={() => (data.isActive ? this.handleInactivate(data) : this.handleActivate(data))} />),
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
    return <BranchEditModal branch={ this.state.branch } onClose={ this.handleCloseModal } />;
  }

  render() {
    const isBranchesLoaded = this.state.branches && this.state.branches.isOk();
    if (!isBranchesLoaded) {
      return <Loader icon={ faSpinner } label={ this.getText('Cargando las sucursales..') } className="fullscreen" />
    }
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{ this.getText('Listado de sucursales') }</Title>
          </LevelLeft>
        </Level>
        <hr/>
        { this.renderTable() }
        { this.state.showModal && this.renderModal() }
      </React.Fragment> )
  }
}

export default withToastManager(withStore(BranchesList));