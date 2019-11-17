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

import moment from 'moment';

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

    this.state = {
      hours: this.availableHours(),
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.professional != this.props.professional) {
      this.professional = this.props.professional;
      this.setState({
        hours: this.availableHours()
      })
    }
    if (prevProps.branch != this.props.branch) {
      this.branch = this.props.branch;
      this.setState({
        hours: this.availableHours()
      })
    }
    if (prevProps.day != this.props.day) {
      this.day = this.props.day;
      this.setState({
        hours: this.availableHours()
      })
    }
    if (prevProps.value != this.props.value) {
      this.value = this.props.value;
      this.setState({
        hours: this.availableHours()
      })
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

  getCleanedAppointment(){
    if(this.availableHours().includes(this.props.value)){
      return this.props.value
    }
    return null
  }

  render() {
    const { disabled } = this.props;
    let difference = Math.abs(Math.floor(moment.duration(moment(this.props.value,"LT").diff(moment())).asMinutes()));

    return(
      <Select 
      disabled={ disabled || this.state.hours == null }
      key={ this.state.hours }
      maxHeight="120px" 
      placeholder={ this.getText('Horarios') } 
      borderless
      value={ difference > 2 ? this.getCleanedAppointment() : null} 
      icon={ faChevronDown }
      className="is-fullwidth" 
      onChange={ this.props.onChange } 
      options={ this.state.hours }/>
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