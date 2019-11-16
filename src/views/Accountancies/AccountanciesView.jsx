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
  Loader,
} from 'shipnow-mercurio';

import { ClientSuggest } from '../../components/Suggest';

import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as SvgDraw } from '../../assets/undraw_finance_0bdk.svg';

@observer
class AccountanciesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client: null,
      clients: null,
      movements: null,
    }

    this.handleChangeClient = this.handleChangeClient.bind(this);
  }

  handleChangeClient( client ) {
    this.setState({
      client,
    })
  }

  componentDidMount() {
    this.setState({
      clients: this.props.store.clients.search({}, 'cc-clients-list', true),
    })    
  }
  

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  renderTable() {
    const { movements } = this.state;
    if (!movements) {
      return(
        <React.Fragment>
          <Title size="lg">{ this.getText('Selecciona un cliente para ver su cuenta') }</Title>
          <SvgDraw style={{width: '85%', marginTop: '-10%', marginRight: '-10%'}}/>
        </React.Fragment> )
    }
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
        <Columns>
          <Column isSize={ 3 }>
            <Field label={ this.getText("Cliente") } labelNote={ this.getText('Selecciona un cliente') }>
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