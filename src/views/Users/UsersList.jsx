import React, { Component } from 'react';

import {
  Title,
  Table,
  SelectableIcon,
  Text,
  Button
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft
} from 'bloomer';

import withStore from '../../hocs/withStore';

import { observer } from 'mobx-react';

import { faSuitcase, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import startCase from 'lodash/startCase';

@observer
class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
    }
  }

  componentDidMount() {
    this.setState({
      users: this.props.store.users.search({}),
    })
  }

  renderTable() {
    const data = this.state.users.toArray();

    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faSuitcase } readOnly/>),
        size: 'is-2',
      },
      {
        label: 'Nombre',
        content: (data) => (<Text>{ startCase(`${ data.fullName }`) }</Text>),
        size: 'is-2'
      },
      {
        label: 'Nombre de usuario',
        content: (data) => (<Text>{ `${ data.username }` }</Text>),
        size: 'is-2'
      },
      {
        label: 'Mail',
        content: (data) => (<Text>{ `${ data.email }` }</Text>),
        size: 'is-2'
      },
      {
        label: 'Rol',
        content: (data) => (<Text>{ `${ data.userRole }` }</Text>),
        size: 'is-2',
      },
      {
        label: '',
        content: (data) => (<Button icon={ faPencilAlt } kind="link" />),
        size: 'is-1',
        align: 'right'
      },
    ]

    return <Table columns={ columns } data={ data } striped={ false }/>
  }

  render() {
    if (!this.state.users || !this.state.users.isOk()) {
      return 'Cargando usuarios..';
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
      </React.Fragment> )
  }

}

export default withStore(UsersList);