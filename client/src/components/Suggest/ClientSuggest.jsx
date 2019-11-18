import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './styles.css';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import {
  TextInput,
  Dropdown,
  DropdownToggle,
  DropdownPanel,
  Text,
} from 'shipnow-mercurio';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

import { withStore } from '../../hocs';

@observer
class ClientSuggest extends Component {
  clients
  constructor(props) {
    super(props);

    this.state = {
      suggest: props.clients,
      value: props.value ? props.value.fullName : '',
      showPanel: false,
    }

    this.clients = props.clients;

    this.handleInput = this.handleInput.bind(this);
  }

  handleInput( sender, value, name ) {
    const filtered = value == '' || !value ? this.clients : this.clients.filter( client => client.fullName.toLowerCase().includes(value.toLowerCase())) 
    this.setState({
      suggest: filtered,
      value: value,
    })
  }

  handleSelect( client ) {
    this.setState({
      value: client == 'null' ? '- Cliente no registrado -' : client.fullName,
      showPanel: false,
    })
    this.props.onChange && this.props.onChange(client);
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const { disabled, withNoClient } = this.props;
    return(
      <Dropdown className="is-fullwidth" disabled={ disabled }>
        <DropdownToggle className="is-fullwidth" disabled={ disabled }>
          <TextInput
            disabled={ disabled }
            borderless={ !this.state.showPanel }
            placeholder={ this.getText('Cliente') }
            className="is-fullwidth" 
            icon={ faChevronDown } 
            value={ this.state.value } 
            onChange={ this.handleInput } 
            onFocus={ () => (this.setState({showPanel: true}))} onBlur={ () => (this.setState({showPanel: false})) }/>
        </DropdownToggle>
          <DropdownPanel>
            { withNoClient && <Text className="mb-1" size="md" onClick={ () => (this.handleSelect('null')) }>{ this.getText('- Cliente no registrado -') }</Text> }
            { this.state.suggest && this.state.suggest.map( (client, index) => (
              index < 5 && <Text className="mb-1" size="md" onClick={ () => (this.handleSelect(client)) }>{ client.fullName }</Text> )) }
          </DropdownPanel>
      </Dropdown> )
  }
}

ClientSuggest.PropTypes = {
  clients: PropTypes.array,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.object,
  withNoClient: PropTypes.bool,
}

ClientSuggest.defaultProps = {
  clients: [],
  disabled: false,
  onChange: null,
  value: null,
  withNoClient: true,
}

export default withStore(ClientSuggest);