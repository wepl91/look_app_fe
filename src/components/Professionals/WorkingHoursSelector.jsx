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
      finishingDate: ''
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange( sender, value, name, valid ) {
    if (name == 'starting') {
      this.setState({
        startingDate: value
      })
    }
    else if (name == 'finishing') {
      this.setState({
        finishingDate: value
      })
    }
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.startingDate != prevState.startingDate || this.state.finishingDate != prevState.finishingDate) {
      this.props.onChange([this.state.startingDate, this.state.finishingDate]);
    }
  }

  hoursBetweenDates(startDate, endDate) {
    let dates = [];
  
    let currDate = moment(startDate).startOf('minute').subtract(30, 'minutes');
    let lastDate = moment(endDate).startOf('minute').add(30, 'minutes');
  
    while(currDate.add(30, 'minutes').diff(lastDate, 'minutes') < 0) {
        dates.push(currDate.clone().format('HH:mm'));
    }
  
    return dates;
  }

  render() {
    let hourList = this.hoursBetweenDates(this.props.startingDate, this.props.finishingDate)
    return(
      <React.Fragment>
        <Columns>
          <Column isSize="1/2">
            <Select placeholder="Entrada" 
                    borderless icon={ faChevronDown } 
                    value = {this.state.startingDate}
                    name="starting" onChange={ this.handleChange } options={ hourList } />
          </Column>
          <Column>
            <Text>a</Text>
          </Column>
          <Column isSize="1/2">
            <Select placeholder="Salida"
                    borderless icon={ faChevronDown }
                    value = {this.state.finishingDate}
                    name="finishing" onChange={ this.handleChange } options={ hourList } />
          </Column>
        </Columns>
      </React.Fragment>)
  }
}

WorkingHoursSelector.PropTypes = {
  startingDate: PropTypes.object,
  finishingDate: PropTypes.object,
  onChange: PropTypes.func
}

WorkingHoursSelector.defaultProps = {
  startingDate: null,
  finishingDate: null,
  onChange: null
}

export default WorkingHoursSelector;