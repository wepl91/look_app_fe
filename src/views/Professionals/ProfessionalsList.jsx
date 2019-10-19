import React, { Component } from 'react';

import {
  Title,
  Table,
  SelectableIcon,
  Text,
  Button,
  Toggle,
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft
} from 'bloomer';

import withStore from '../../hocs/withStore';
import { withToastManager } from 'react-toast-notifications';

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
      professionals: this.props.store.professionals.search({}, 'list-professionals-view', true),
    })
  }

  handleModal( professional ) {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
      professionalToEdit: professional,
    }))
  }

  handleActivate( user ) {
    const { toastManager } = this.props;
    user.activate().andThen( (savedUser, responseError) => {
      if (responseError) {
        toastManager.add("Ups! Parece que hubo un error al activar el profesional!", {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
      else {
        let text = <Text color="warning" weight="medium" className="mt-1 mb-1">¡El profesional ha sido marcado como activo!</Text>
        toastManager.add(text, {
          appearance: 'warning',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
    })
  }

  handleInactivate( user ) {
    const { toastManager } = this.props;
    user.deactivate().andThen( (savedUser, responseError) => {
      if (responseError) {
        toastManager.add("Ups! Parece que hubo un error al desactivar el profesional!", {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
      else {
        let text = <Text color="warning" weight="medium" className="mt-1 mb-1">¡El profesional ha sido marcado como inactivo!</Text>
        toastManager.add(text, {
          appearance: 'warning',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
    })
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
      },
      {
        label: 'Teléfono',
        content: (data) => (<Text>{ data.phone || '- sin teléfono -' }</Text>),
      },
      {
        label: 'Mail',
        content: (data) => (<Text>{ data.email || '- sin email -' }</Text>),
      },
      {
        label: 'Servicios Ofrecidos',
        content: (data) => (data.professionalServices.map(name => (<Text weight="medium" className="mb-2"><FontAwesomeIcon className="mr-1" icon={ faDotCircle } size="xs" fixedWidth/>{ name }</Text>))),
      },
      {
        label: 'Horario de trabajo',
        content: (data) => (<Text weight="medium" className="mb-2">{ data.cookedWorkingHours }</Text>),
      },
      {
        label: 'Días de trabajo',
        content: (data) => (data.cookedWorkingDays.map(day => (<Text weight="medium" className="mb-2 mt-2"><FontAwesomeIcon className="mr-1" icon={ faDotCircle } size="xs" fixedWidth/>{ day }</Text>))),
      },
      {
        label: 'Activo',
        content: (data) => (<Toggle checked={ data.isActive } checkedColor="success" unCheckedColor="delete" onChange={ () => (data.isActive ? this.handleInactivate(data) : this.handleActivate(data)) }/>),
      },
      {
        label: '',
        content: (data) => (<Button icon={ faPencilAlt } kind="link" onClick={ () => (this.handleModal(data)) }/>),
        size: 'is-1',
        align: 'left'
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

export default withToastManager(withStore(ProfessionalsList));