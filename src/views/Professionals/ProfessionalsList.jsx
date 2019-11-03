import React, { Component } from 'react';

import {
  Title,
  Table,
  SelectableIcon,
  Text,
  Button,
  Toggle,
  Dropdown,
  DropdownToggle,
  DropdownPanel,
} from 'shipnow-mercurio';

import {
  Level,
  LevelLeft,
  Column
} from 'bloomer';

import withStore from '../../hocs/withStore';
import { withToastManager } from 'react-toast-notifications';

import { observer } from 'mobx-react';

import { faSuitcase, faPencilAlt, faDotCircle, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { ProfessionalsEditModal } from '../../components/Professionals';

import startCase from 'lodash/startCase';
import { Columns } from 'bloomer/lib/grid/Columns';

import { translate } from '../../lib/Translator'

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
        size: 'is-1'
      },
      {
        label: this.getText('Nombre'),
        content: (data) => (<Text>{ startCase( data.fullName || this.getText('- sin nombre -')  )}</Text>),
        size: 'is-2'
      },
      {
        label: this.getText('Teléfono'),
        content: (data) => (<Text>{ data.phone || this.getText('- sin teléfono -') }</Text>),
        size: 'is-1',
      },
      {
        label: this.getText('Email'),
        content: (data) => (<Text>{ data.email || this.getText('- sin email -') }</Text>),
        size: 'is-2'
      },
      {
        label: this.getText('Servicios ofrecidos'),
        content: (data) => (
          data.professionalServices.length > 0 ?
          <Dropdown className="is-fullwidth">
            <DropdownToggle className="is-fullwidth">
              <Text>
                { `${ this.getText('Servicios') } ` }
                <FontAwesomeIcon className="mr-1" icon={ faChevronDown } size="xs" fixedWidth/>
              </Text>
            </DropdownToggle>
            <DropdownPanel>
            {data.professionalServices.map(name => (
                  <Text className="mb-1" size="md" ><FontAwesomeIcon className="mr-1" icon={ faDotCircle } size="xs" fixedWidth/>{ name }</Text> 
            ))}
            </DropdownPanel>
        </Dropdown>
        :
        <Text>{ this.getText('- Sin servicios -') }</Text>
        ),
        size: 'is-2'
      },
      {
        label: this.getText('Días de trabajo'),
        content: (data) => (
          <Dropdown className="is-fullwidth">
            <DropdownToggle className="is-fullwidth">
              <Text>
                {`${ this.getText('Días y horarios') }  `} 
                <FontAwesomeIcon className="mr-1" icon={ faChevronDown } size="xs" fixedWidth/>
              </Text>
            </DropdownToggle>
            <DropdownPanel>
            {data.cookedWorkingDays.map(days => (
              <React.Fragment>
              <Columns>
                <Column>
                  <Text size="md" >{ this.getText(days.day) }</Text> 
                </Column>
                <Column>
                  <Text className="has-text-right" size="md" >{ `${days.begin} ${ this.getText('a') } ${days.end}` }</Text> 
                </Column>
                </Columns>
              </React.Fragment>
            ))}
            </DropdownPanel>
        </Dropdown>
        ),
        size: 'is-2'
      },
      {
        label: this.getText('Activo'),
        content: (data) => (<Toggle checked={ data.isActive } checkedColor="success" unCheckedColor="delete" onChange={ () => (data.isActive ? this.handleInactivate(data) : this.handleActivate(data)) }/>),
        size: 'is-1',
      },
      {
        label: '',
        content: (data) => (<Button icon={ faPencilAlt } kind="link" onClick={ () => (this.handleModal(data)) }/>),
        size: 'is-1',
        align: 'center'
      },
    ]

    return <Table columns={ columns } data={ data } striped={ false }/>
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    if (!this.state.professionals || !this.state.professionals.isOk()) {
      return this.getText('Cargando profesionales..');
    }
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{ this.getText('Lista de profesionales') }</Title>
          </LevelLeft>
        </Level>
        <hr/>
        { this.renderTable() }
        { this.state.showModal && <ProfessionalsEditModal professional={ this.state.professionalToEdit } onClose={ () => ( this.handleModal(null) ) }/> }
      </React.Fragment> )
  }

}

export default withToastManager(withStore(ProfessionalsList));