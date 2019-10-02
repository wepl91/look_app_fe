import React, { Component } from 'react';

import {
  Title,
  Button,
  Table,
  SelectableIcon,
  Text
} from 'shipnow-mercurio';

import {
  Columns,
  Column,
  Level,
  LevelLeft,
  LevelRight
} from 'bloomer';

import withStore from '../../hocs/withStore';

import { observer } from 'mobx-react';

import { faCut, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import { ServiceCreationModal } from '../../components/Services';

import startCase from 'lodash/startCase';

@observer
class ServicesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreationModal: false,
      services: null
    }

    this.handleModal = this.handleModal.bind(this);
  }

  componentDidMount() {
    this.setState({
      services: this.props.store.services.search({}),
    })
  }
  

  handleModal() {
    this.setState(prevState => ({
      showCreationModal: !prevState.showCreationModal,
    }))
  }

  renderTable() {
    debugger
    const data = this.state.services.toArray();

    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faCut } readOnly/>),
        size: 'is-2',
      },
      {
        label: 'Servicio',
        content: (data) => (<Text>{ startCase(data.name) }</Text>),
        size: 'is-3'
      },
      {
        label: 'Precio',
        content: (data) => (<Text>{ `$${ data.cost }` }</Text>),
        size: 'is-3'
      },
      {
        label: 'Duración',
        content: (data) => (<Text>{ `${ data.duration } minutos` }</Text>),
        size: 'is-3'
      },
      {
        label: '',
        content: (data) => (<Button icon={ faPencilAlt } kind="link"/>),
        size: 'is-1',
        align: 'left'
      },
    ]

    return <Table columns={ columns } data={ data } striped={ false }/>
  }

  render() {
    if (!this.state.services || !this.state.services.isOk()) {
      return 'Cargando servicios..';
    }
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Lista de servicios</Title>
          </LevelLeft>
        </Level>
        <hr/>
        { this.renderTable() }
      </React.Fragment> )
  }

}

export default withStore(ServicesList);