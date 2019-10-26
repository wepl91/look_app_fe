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
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  LevelRight
} from 'bloomer';

import { translate } from '../../lib/Translator';

import { faSpinner, faStoreAlt, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

@observer
class BranchesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      branches: null,
      showModal: false,
    }
  }

  componentDidMount() {
    this.setState({
      branches: this.props.store.branches.search({}, 'branches-list', true),
    })
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  handleShowModal( branch ) {
    
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
        content: (data) => (<Text>{ startCase( data.name) || '- sin nombre -' }</Text>),
        size: 'is-2'
      },
      {
        label: this.getText('Dirección'),
        content: (data) => (<Text>{ data.address || '- sin dirección -' }</Text>),
        size: 'is-2'
      },
      {
        label: this.getText('Estado'),
        content: (data) => (<Text>{ `${ data.status }` }</Text>),
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
    return null;
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