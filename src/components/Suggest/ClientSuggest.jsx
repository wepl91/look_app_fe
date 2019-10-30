import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './styles.css';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import {
  TextInput,
  Panel,
  Dropdown,
  DropdownToggle,
  DropdownPanel,
  Text,
} from 'shipnow-mercurio';

class ClientSuggest extends Component {
  clients
  constructor(props) {
    super(props);

    this.state = {
      suggest: props.clients,
      value: '',
      showPanel: false,
    }

    this.clients = props.clients;

    this.handleInput = this.handleInput.bind(this);
  }

  handleInput( sender, value, name ) {
    const filtered = value == '' ? this.clients : this.clients.filter( client => client.fullName.includes(value)) 
    this.setState({
      suggest: filtered,
      value: value,
    })
  }

  handleSelect( client ) {
    this.setState({
      value: client.fullName,
      showPanel: false,
    })
  }

  render() {
    return(
      <Dropdown className="is-fullwidth">
        <DropdownToggle className="is-fullwidth">
          <TextInput
            borderless={ !this.state.showPanel }
            placeholder="Cliente"
            className="is-fullwidth" 
            icon={ faChevronDown } 
            value={ this.state.value } 
            onChange={ this.handleInput } 
            onFocus={ () => (this.setState({showPanel: true}))} onBlur={ () => (this.setState({showPanel: false})) }/>
        </DropdownToggle>
          <DropdownPanel>
            { this.state.suggest && this.state.suggest.map( (client, index) => (
              index < 5 && <Text className="mb-1" size="md" onClick={ () => (this.handleSelect(client)) }>{ client.fullName }</Text> )) }
          </DropdownPanel>
      </Dropdown> )
  }


}

ClientSuggest.PropTypes = {
  clients: PropTypes.array,
}

ClientSuggest.defaultProps = {
  clients: [],
}

export default ClientSuggest