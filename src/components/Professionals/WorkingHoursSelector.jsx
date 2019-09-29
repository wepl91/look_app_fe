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
      startingDate: this.props.startingDate,
      finishingDate: this.props.finishingDate
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.startingDate != this.props.startingDate) {
      this.setState(prevState => ({
        reload: !prevState
      }))
    }
    if (prevProps.finishingDate != this.props.finishingDate) {
      this.setState(prevState => ({
        reload: !prevState
      }))
    }
  }

  render() {
    return(
      <React.Fragment>
        <Columns>
          <Column isSize="1/2">
            <Select placeholder="Entrada" borderless icon={ faChevronDown } options={ hoursBetweenDates(this.state.startingDate, this.state.finishingDate) } />
          </Column>
          <Column>
            <Text>a</Text>
          </Column>
          <Column isSize="1/2">
            <Select placeholder="Salida" borderless icon={ faChevronDown } options={ hoursBetweenDates(this.state.startingDate, this.state.finishingDate) } />
          </Column>
        </Columns>
      </React.Fragment>)
  }
}

function hoursBetweenDates(startDate, endDate) {
  let dates = [];

  let currDate = moment(startDate).startOf('minute').subtract(30, 'minutes');
  let lastDate = moment(endDate).startOf('minute').add(30, 'minutes');

  while(currDate.add(30, 'minutes').diff(lastDate, 'minutes') < 0) {
      dates.push(currDate.clone().format('HH:mm'));
  }

  return dates;
};

WorkingHoursSelector.PropTypes = {
  startingDate: PropTypes.object,
  finishingDate: PropTypes.object
}

WorkingHoursSelector.defaultProps = {
  startingDate: null,
  finishingDate: null
}

export default WorkingHoursSelector;