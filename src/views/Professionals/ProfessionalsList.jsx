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

import { faSuitcase, faPencilAlt, faDotCircle } from "@fortawesome/free-solid-svg-icons";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { ProfessionalsEditModal } from '../../components/Professionals';

import startCase from 'lodash/startCase';

@observer
class ProfessionalsList extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showModal: false,
      professionals: null,
      professionalToEdit: null,
    }
  }

  componentDidMount() {
    this.setState({
      professionals: this.props.store.professionals.getAll(),
    })
  }

  handleModal( professional ) {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      professionalToEdit: professional,
    }))
  }

  renderTable() {
    const data = this.state.professionals.toArray();
    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faSuitcase } readOnly/>),
        size: 'is-1',
      },
      {
        label: 'Nombre',
        content: (data) => (<Text>{ startCase( data.fullName || '- sin nombre -'  )}</Text>),
        size: 'is-2'
      },
      {
        label: 'Teléfono',
        content: (data) => (<Text>{ data.phone || '- sin teléfono -' }</Text>),
        size: 'is-2'
      },
      {
        label: 'Mail',
        content: (data) => (<Text>{ data.email || '- sin email -' }</Text>),
        size: 'is-2'
      },
/*       {
        label: 'Estado',
        content: (data) => (<Text>{ `${ data.professionalStatus }` }</Text>),
        size: 'is-2'
      }, */
      {
        label: 'Servicios Ofrecidos',
        content: (data) => (data.professionalServices.map(name => (<Text weight="medium" className="mb-2"><FontAwesomeIcon icon={ faDotCircle } size="xs" fixedWidth/>{ name }</Text>))),
        size: 'is-2'
      },
      {
        label: '',
        content: (data) => (<Button icon={ faPencilAlt } kind="link" onClick={ () => (this.handleModal(data)) }/>),
        size: 'is-1',
        align: 'right'
      },
    ]

    return <Table columns={ columns } data={ data } striped={ false }/>
  }

  render() {
    if (!this.state.professionals || !this.state.professionals.isOk()) {
      return 'Cargando usuarios..';
    }
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Lista de profesionales</Title>
          </LevelLeft>
        </Level>
        <hr/>
        { this.renderTable() }
        { this.state.showModal && <ProfessionalsEditModal professional={ this.state.professionalToEdit } onClose={ () => ( this.handleModal(null) ) }/> }
      </React.Fragment> )
  }

}

export default withStore(ProfessionalsList);