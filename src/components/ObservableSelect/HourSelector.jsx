import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import {
  Select
} from 'shipnow-mercurio';

import { observable } from 'mobx';

import { translate } from '../../lib/Translator';

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

@observer
class HourSelector extends Component {
  @observable professional;
  @observable branch;
  @observable day;
  @observable value;
  
  constructor(props) {
    super(props);

    this.professional = props.professional;
    this.branch = props.branch;
    this.day = props.day;
    this.value = props.value;
    this.availableHours = this.availableHours.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.professional != this.props.professional) {
      this.professional = this.props.professional;
    }
    if (prevProps.branch != this.props.branch) {
      this.branch = this.props.branch;
    }
    if (prevProps.day != this.props.day) {
      this.day = this.props.day;
    }
    if (prevProps.value != this.props.value) {
      this.value = this.props.value;
    }
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  availableHours(){
    if(this.branch){
      if(this.professional){
        return this.professional.filteredWorkingHours(this.day)
      }else{
        return this.branch.openHours(this.day)
      }
    }else{
      return null
    }
  }

  render() {
    const { disabled } = this.props;
    return(
      <Select 
      disabled={ disabled }
      key={ this.branch || this.professional || this.day }
      maxHeight="120px" 
      placeholder={ this.getText('Horarios') } 
      borderless 
      icon={ faChevronDown }
      onChange={ this.props.onChange } 
      value={ this.props.value }
      options={ this.availableHours() }/>
    )
  }
}

HourSelector.PropTypes = {
  professional: PropTypes.object,
  branch: PropTypes.object,
  day: PropTypes.object,
  disabled: PropTypes.bool,
  value: PropTypes.object,
  onChange: PropTypes.func,
}

HourSelector.defaultProps = {
  professional: null,
  branch: null,
  day: null,
  disabled: false,
  value: null,
  onChange: null,
}

export default withStore(HourSelector);