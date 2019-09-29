import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Columns,
  Column
} from 'bloomer';

import {
  Select,
  Text
} from 'shipnow-mercurio';

import moment from 'moment';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
 
class WorkingHoursSelector extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      startingDate: '',
      finishingDate: '',
      buttonDisabled: false
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange( sender, value, name, valid ) {

    if (name == 'starting') {
      this.setState({
        startingDate: value
      })
    }
    if (name == 'finishing') {
      this.setState({
        finishingDate: value
      })
    }

    console.log("************************************")
    console.log(this.state.startingDate)
    console.log(this.state.finishingDate)
  }

  hoursBetweenDates(startDate, endDate) {
    let dates = [];
  
    let currDate = moment(startDate).startOf('minute');
    let lastDate = moment(endDate).startOf('minute');
  
    while(currDate.add(30, 'minutes').diff(lastDate, 'minutes') < 0) {
        dates.push(currDate.clone().format('HH:mm'));
    }
  
    return dates;
  }

  render() {
    return(
      <React.Fragment>
        <Columns>
          <Column isSize="1/2">
            <Select placeholder="Entrada" 
                    borderless icon={ faChevronDown } 
                    value = {this.state.startingDate}
                    validate={ (value) => (moment(value, 'HH:mm').isBefore(moment(this.state.finishingDate, 'HH:mm'))) }
                    name="starting" onChange={ this.handleChange } options={ this.hoursBetweenDates(this.props.startingDate, this.props.finishingDate) } />
          </Column>
          <Column>
            <Text>a</Text>
          </Column>
          <Column isSize="1/2">
            <Select placeholder="Salida"
                    borderless icon={ faChevronDown }
                    value = {this.state.finishingDate}
                    validate={ (value) => (moment(value, 'HH:mm').isAfter(moment(this.state.startingDate, 'HH:mm'))) }
                    name="finishing" onChange={ this.handleChange } options={ this.hoursBetweenDates(this.props.startingDate, this.props.finishingDate) } />
          </Column>
        </Columns>
      </React.Fragment>)
  }
}

WorkingHoursSelector.PropTypes = {
  startingDate: PropTypes.object,
  finishingDate: PropTypes.object
}

WorkingHoursSelector.defaultProps = {
  startingDate: null,
  finishingDate: null
}

export default WorkingHoursSelector;