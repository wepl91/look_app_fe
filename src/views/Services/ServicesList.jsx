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

import { faCut, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import { ServiceCreationModal } from '../../components/Services';

class ServicesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreationModal: false,
    }

    this.handleModal = this.handleModal.bind(this);
  }

  handleModal() {
    this.setState(prevState => ({
      showCreationModal: !prevState.showCreationModal,
    }))
  }

  renderTable() {
    const data = [
      {
        name: 'Corte',
        price: '200'
      },
      {
        name: 'Tintura',
        price: '250'
      },
      {
        name: 'Shock keratina',
        price: '450'
      },
      {
        name: 'Brushing',
        price: '300'
      },
    ];

    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faCut } readOnly/>),
        size: 'is-2',
      },
      {
        label: 'Servicio',
        content: (data) => (<Text>{ data.name }</Text>),
        size: 'is-3'
      },
      {
        label: 'Precio',
        content: (data) => (<Text>{ `$${ data.price }` }</Text>),
        size: 'is-3'
      },
      {
        label: '',
        content: (data) => (<Button icon={ faPencilAlt } kind="link"/>),
        size: 'is-3',
        align: 'right'
      },
    ]

    return <Table columns={ columns } data={ data } striped={ false }/>
  }

  render() {
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

export default ServicesList;