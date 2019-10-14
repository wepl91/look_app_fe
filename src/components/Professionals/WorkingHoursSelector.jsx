import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Columns,
  Column,
  Checkbox,
  Control
} from 'bloomer';

import {
  Select,
  Text,
  Field
} from 'shipnow-mercurio';

import startCase from 'lodash/startCase';

import moment from 'moment';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { LevelItem } from 'bloomer/lib/components/Level/LevelItem';
 
class WorkingHoursSelector extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      startingDate: '',
      finishingDate: '',
      days: []
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

  handleDays( received ) {
      let newArray = Array.from(this.state.days)
      if(newArray.includes(received)){
        newArray = newArray.filter(item => item !== received)
      }else{
        newArray.push(received)
      }
      this.setState({
        days: newArray,
      });
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.days != prevState.days || this.state.startingDate != prevState.startingDate || this.state.finishingDate != prevState.finishingDate) {
      this.props.onChange([this.state.days , this.state.startingDate, this.state.finishingDate]);
    }
  }

  //30 minutes intervals
  // hoursBetweenDates(startDate, endDate) {
  //   let dates = [];
  
  //   let currDate = moment(startDate).startOf('minute').subtract(30, 'minutes');
  //   let lastDate = moment(endDate).startOf('minute').add(30, 'minutes');
  
  //   while(currDate.add(30, 'minutes').diff(lastDate, 'minutes') < 0) {
  //       dates.push(currDate.clone().format('HH:mm'));
  //   }
  
  //   return dates;
  // }

  //1 hour intervals
  hoursBetweenDates(startDate, endDate) {
    let hours = [];
  
    let currDate = moment(startDate).startOf('minute').subtract(60, 'minutes');
    let lastDate = moment(endDate).startOf('minute').add(60, 'minutes');
  
    while(currDate.add(60, 'minutes').diff(lastDate, 'minutes') < 0) {
        hours.push(currDate.clone().format('HH:mm'));
    }
  
    return hours;
  }

  render() {
    let hourList = this.hoursBetweenDates(this.props.startingDate, this.props.finishingDate)
    let daysList = this.props.days
    return(
      <React.Fragment>
        <Columns className="is-gapless is-marginless" isVCentered isCentered>
        {daysList.map(day => (
                  <Checkbox className="pr-1 pb-2" name="day" isFullWidth onClick={() => this.handleDays(day)} ><Text className="pl-1">{startCase(day.toLowerCase())}</Text></Checkbox>
                ))}
        </Columns>
        <Columns className="is-gapless is-marginless" isVCentered isCentered>
          <Column isSize={5}>
            <Select placeholder="Entrada" 
                    className="is-fullwidth"
                    borderless icon={ faChevronDown } 
                    value = {this.state.startingDate}
                    name="starting" onChange={ this.handleChange } options={ hourList } />
          </Column>
          <Column isSize={2} className="has-text-centered">
            <Text>a</Text>
          </Column>
          <Column isSize={5}>
            <Select placeholder="Salida"
                    className="is-fullwidth"
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
  days: PropTypes.array,
  onChange: PropTypes.func,
  validate: PropTypes.func
}

WorkingHoursSelector.defaultProps = {
  startingDate: null,
  finishingDate: null,
  days: null,
  onChange: null,
  validate: null
}

export default WorkingHoursSelector;