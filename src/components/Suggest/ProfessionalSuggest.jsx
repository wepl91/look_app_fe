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

import { observable } from 'mobx';

import { translate } from '../../lib/Translator';

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

@observer
class ProfessionalSuggest extends Component {
  @observable professionals;
  @observable suggest;
  @observable value;
  
  constructor(props) {
    super(props);

    this.state = {
      showPanel: false,
    }

    this.professionals = props.professionals;
    this.suggest = props.professionals;
    this.value = props.value ? props.value.fullName : '';
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput( sender, value, name ) {
    if (value == this.getText('- Ninguno -')) {
      this.props.onChange && this.props.onChange(null);
    }
    const filtered = value == '' || !value ? this.professionals : this.professionals.filter( professional => professional.fullName.includes(value)) 
    this.suggest = filtered;
    this.value = value;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.professionals != this.props.professionals) {
      this.professionals = this.props.professionals;
      this.suggest = this.props.professionals;
    }
    if (prevProps.value != this.props.value) {
      this.value = this.props.value;
    }
  }

  handleSelect( professional ) {
    this.value = professional == 'null' ? this.getText('- Ninguno -'): professional.fullName;
    this.setState({
      showPanel: false,
    })
    this.props.onChange && this.props.onChange(professional == 'null' ? null : professional);
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const { disabled } = this.props;
    return(
      <Dropdown key={ this.state.suggest || this.state.value } className="is-fullwidth" disabled={ disabled }>
        <DropdownToggle className="is-fullwidth" disabled={ disabled }>
          <TextInput
            disabled={ disabled }
            borderless={ !this.state.showPanel }
            placeholder={ this.getText('Profesional') }
            className="is-fullwidth" 
            icon={ faChevronDown } 
            value={ this.value } 
            onChange={ this.handleInput } 
            onFocus={ () => (this.setState({showPanel: true}))} onBlur={ () => (this.setState({showPanel: false})) }/>
        </DropdownToggle>
          <DropdownPanel key={ this.state.suggest }>
            <Text className="mb-1" size="md" onClick={ () => (this.handleSelect('null')) }>{ this.getText('- Ninguno -') }</Text>
            { this.suggest && this.suggest.map( (professional, index) => (
              index < 5 && professional.isActive && <Text className="mb-1" size="md" onClick={ () => (this.handleSelect(professional)) }>{ professional.fullName }</Text> )) }
          </DropdownPanel>
      </Dropdown> )
  }


}

ProfessionalSuggest.PropTypes = {
  professionals: PropTypes.array,
  disabled: PropTypes.bool,
  value: PropTypes.object,
  onChange: PropTypes.func,
}

ProfessionalSuggest.defaultProps = {
  professionals: [],
  disabled: false,
  value: null,
  onChange: null,
}

export default withStore(ProfessionalSuggest);