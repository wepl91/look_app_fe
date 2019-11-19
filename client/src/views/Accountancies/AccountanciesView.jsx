import React, { Component } from 'react';

import withStore from '../../hocs/withStore';
import { withToastManager } from 'react-toast-notifications';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

import {
  Level,
  LevelLeft,
  Columns,
  Column,
} from 'bloomer';

import {
  Title,
  Field,
  Table,
  Text,
  Button,
  Loader,
  SelectableIcon,
  Panel,
} from 'shipnow-mercurio';

import { 
  ClientSuggest 
} from '../../components/Suggest';

import { 
  faSpinner, 
  faPiggyBank 
} from '@fortawesome/free-solid-svg-icons'

import { 
  ReactComponent as SvgDraw 
} from '../../assets/undraw_finance_0bdk.svg';

import {
  AppointmentDetailsModal
} from '../../components/Appointments';

import moment from 'moment';

@observer
class AccountanciesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client: null,
      clients: null,
      accountancy: null,
      isLoading: true,
      appointment: null,
      showModal: false,
    }

    this.handleChangeClient = this.handleChangeClient.bind(this);
    this.handleCloseModal   = this.handleCloseModal.bind(this);
  }

  handleCloseModal( reload = false ) {
    if (reload) {
      this.sendRequest();
    }
    else {
      this.setState({
        showModal: false,
        appointment: null,
      });
    }
  }

  handleChangeClient( client ) {
    this.setState({
      client,
    })
  }

  handleModal( appointment ) {
    this.setState({
      showModal: true,
      appointment: appointment,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.client != this.state.client) {
      this.sendRequest();
    }
  }

  componentDidMount() {
    this.setState({
      clients: this.props.store.clients.search({}, 'cc-clients-list', true),
    })    
  }
  
  sendRequest() {
    this.setState({
      isLoading: true,
    }, () => {
      this.props.store.accountancies.get(this.state.client.id).then(res => {
        this.setState({
          accountancy: res,
          isLoading:false,
          showModal: false,
        });
      });
    });
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  renderModal() {
    return <AppointmentDetailsModal appointment={ this.state.appointment } onClose={ this.handleCloseModal }/>
  }

  renderTable() {
    const { accountancy } = this.state;
    if (!accountancy) {
      return(
        <React.Fragment>
          <Title size="lg">{ this.getText('Selecciona un cliente para ver su cuenta') }</Title>
          <SvgDraw style={{width: '85%', marginTop: '-10%', marginRight: '-10%'}}/>
        </React.Fragment> )
    }
    const data = this.state.accountancy.movements;
    const columns = [
      {
        label: '',
        content: (data) => (<SelectableIcon  className="ml-2" icon={ faPiggyBank } readOnly/>),
        size: 'is-1',
      },
      {
        label: 'Fecha de pago',
        content: (data) => (<Text>{ moment(data.dateCreated).format('DD-MM-YYYY HH:mm') }</Text>),
        size: 'is-4',
      },
      {
        label: 'Fecha del turno',
        content: (data) => (<Button kind="link" onClick={ () => (this.handleModal(data.appointment)) }>{ moment(data.appointment.dateCreated).format('DD-MM-YYYY') }</Button>),
        size: 'is-4',
      },
      {
        label: 'Monto',
        content: (data) => (<Text>{ `$${data.amount}` }</Text>),
        size: 'is-3',
      },
    ];

    if (!data.length) {
      return(
        <React.Fragment>
          <Title size="lg">{ this.getText('Este cliente aún no ha registrado ningún pago') }</Title>
          <SvgDraw style={{width: '85%', marginTop: '-10%', marginRight: '-10%'}}/>
        </React.Fragment> )
    }

    return <Table data={data} columns={columns} striped={ false }/> 
  }

  renderStatus() {
    const { accountancy } = this.state;
    let total = 0;
    if (!accountancy) return null;
    if (accountancy && !accountancy.movements.length) return null;

    accountancy.movements.forEach(mov => {
      total += parseInt(mov.amount)
    });

    return(
    <Panel className="mt-4"  invert color={ total < 0 ? 'danger' : 'success' }>
      <Text size="lg" weight="medium">{ total < 0 ? `El cliente presenta una deuda de $${ total.toString().split('-')[1] }` : 'El cliente no presenta deudas' }</Text>
    </Panel>) 
  }

  render() {
    const isClientsLoaded = this.state.clients && this.state.clients.isOk();
    if (!isClientsLoaded) { 
      return <Loader icon={faSpinner} className="fullscreen" label={ this.getText("Cargando los clientes...")} animation="spin" /> 
    }
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{ this.getText('Cuenta corriente de clientes') }</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns className="pt-4">
          <Column isSize={ 4 } className="pl-5">
            <Field label={ this.getText("Cliente") } 
                   labelNote={ this.getText('Selecciona un cliente') }>
              <ClientSuggest
                withNoClient={false}
                clients={ this.state.clients.toArray() } 
                client={ this.state.client }
                onChange={ this.handleChangeClient } />
            </Field>
          { this.renderStatus() }
          </Column>
          <Column isSize={ 2 }></Column>
          <Column isSize={ 6 } className="has-text-centered">
            { this.renderTable()  }
          </Column>
        </Columns>
        { this.state.showModal && this.renderModal() }
      </React.Fragment> )
  }
}

export default withStore(withToastManager(AccountanciesView))