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

import { faCut, faPencilAlt, faSuitcase } from "@fortawesome/free-solid-svg-icons";

import { profesionales} from '../../lib/Mocks';

class ProfessionalsList extends Component {
  constructor(props) {
    super(props);
  }

  renderTable() {
    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faSuitcase } readOnly/>),
        size: 'is-1',
      },
      {
        label: 'Nombre',
        content: (data) => (<Text>{ data.name + " " + data.surname}</Text>),
        size: 'is-2'
      },
      {
        label: 'Teléfono',
        content: (data) => (<Text>{ `${ data.phone }` }</Text>),
        size: 'is-2'
      },
      {
        label: 'Mail',
        content: (data) => (<Text>{ `${ data.mail }` }</Text>),
        size: 'is-2'
      },
      {
        label: 'Sucursal',
        content: (data) => (<Text>{ `${ data.branch }` }</Text>),
        size: 'is-2'
      },
      {
        label: 'Servicios Ofrecidos',
        content: (data) => (<Text>{ `${ data.services }` }</Text>),
        size: 'is-2'
      },
    ]

    return <Table columns={ columns } data={ profesionales() } striped={ false }/>
  }

  render() {
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Lista de profesionales</Title>
          </LevelLeft>
        </Level>
        <hr/>
        { this.renderTable() }
      </React.Fragment> )
  }

}

export default ProfessionalsList;