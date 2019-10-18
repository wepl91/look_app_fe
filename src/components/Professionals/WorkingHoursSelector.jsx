import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Columns,
  Column,
  Checkbox
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
      days: []
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    if(this.props.defaultProfessional !== null &&  this.props.defaultProfessional  !== null){
      this.setState({
        startingDate: this.props.defaultProfessional.beginHour,
        finishingDate: this.props.defaultProfessional.endHour
      })
    }
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
    const translatedDays = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    }

    return(
      <React.Fragment>
        <Columns className="is-gapless is-marginless" isCentered isVCentered>
          <Column isSize={6}>
          {daysList.map(day => (
                    <Checkbox className="pr-1 pb-2" name="day" isFullWidth defaultChecked={ this.props.defaultProfessional && this.props.defaultProfessional.cookedWorkingDays.includes(translatedDays[day])} onClick={() => this.handleDays(day)} ><Text className="pl-1">{translatedDays[day]}</Text></Checkbox>
                  ))}
          </Column>
          <Column isSize={6}>
            <Select placeholder="Entrada" 
                    className="is-fullwidth"
                    borderless icon={ faChevronDown } 
                    value = {this.state.startingDate}
                    name="starting" onChange={ this.handleChange } options={ hourList } />
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
  defaultProfessional: PropTypes.object,
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