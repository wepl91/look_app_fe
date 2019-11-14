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
  Select,
  Table,
  Text,
  Button,
  Loader,
  SelectableIcon,
} from 'shipnow-mercurio';

import { ClientSuggest } from '../../components/Suggest';

import { faSpinner, faPiggyBank } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as SvgDraw } from '../../assets/undraw_finance_0bdk.svg';

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
    }

    this.handleChangeClient = this.handleChangeClient.bind(this);
  }

  handleChangeClient( client ) {
    this.setState({
      client,
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
          isLoading:false
        });
      });
    });
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
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
        size: 'is-5',
      },
      {
        label: 'Fecha del turno',
        content: (data) => (<Button kind="link">{ moment(data.appointment.dateCreated).format('DD-MM-YYYY') }</Button>),
        size: 'is-4',
      },
    ];

    if (!data.length) {
      return(
        <React.Fragment>
          <Title size="lg">{ this.getText('Este cliente aún no ha registrado ningún pago') }</Title>
          <SvgDraw style={{width: '85%', marginTop: '-10%', marginRight: '-10%'}}/>
        </React.Fragment> )
    }

    return <Table data={data} columns={columns} /> 
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
          <Column isSize={ 3 } className="pl-5">
            <Field label={ this.getText("Cliente") } 
                   labelNote={ this.getText('Selecciona un cliente') }>
              <ClientSuggest
                withNoClient={false}
                clients={ this.state.clients.toArray() } 
                client={ this.state.client }
                onChange={ this.handleChangeClient } />
            </Field>
          </Column>
          <Column isSize={ 3 }></Column>
          <Column isSize={ 6 } className="has-text-centered">
            { this.renderTable() }
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withStore(withToastManager(AccountanciesView))