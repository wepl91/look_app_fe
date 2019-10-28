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
import _ from 'lodash';

class WorkingHoursSelector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      days: {},
      disabled: true
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.props.defaultProfessional) {
      this.setState({
        days: this.props.defaultProfessional.rawWorkingDays
      })
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   this.props.onChange(this.state.days);
  // }

  //1 hour intervals
  hoursBetweenDates(startDate, endDate) {
    let hours = [];

    let currDate = moment(startDate).startOf('minute').subtract(60, 'minutes');
    let lastDate = moment(endDate).startOf('minute').add(60, 'minutes');

    while (currDate.add(60, 'minutes').diff(lastDate, 'minutes') < 0) {
      hours.push(currDate.clone().format('HH:mm'));
    }

    return hours;
  }

  handleDays(received) {
    let dictClone = Object.assign(this.state.days)
    if (received in dictClone) {
      delete dictClone[received]
    } else {
      dictClone[received] = {}
    }
    this.setState({
      days: dictClone
    });
    this.props.onChange(this.state.days);
  }

  handleChange(sender, value, name, valid) {
    let dictClone = Object.assign(this.state.days)
    let day = name.substring(0, name.length -3)
    name = name.slice(-3) //sta o fin

    if (name == 'sta') {
      dictClone[day]['sta'] = value 
    }
    else if (name == 'fin') {
      dictClone[day]['fin'] = value 
    }
    this.setState({
      days: dictClone
    });
    this.props.onChange(this.state.days);
  }

  getDisabledSelect(day){
    return (day in this.state.days)
  }

  render() {
    let hourList = this.hoursBetweenDates(this.props.startingDate, this.props.finishingDate)
    // let daysList = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    let daysList = this.props.days
    const translatedDays = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
    }

    return (
      <React.Fragment>
      {daysList.map(day => (
        <React.Fragment>
        {/* <Checkbox className="pr-1 mr-1 mt-2" name={ day } isFullWidth defaultChecked={this.props.defaultProfessional && this.props.defaultProfessional.cookedWorkingDays.includes(translatedDays[day])} onClick={() => this.handleDays(day)} ><Text className="ml-1">{translatedDays[day]}</Text></Checkbox> */}
        <Checkbox className="pr-1 mr-1 mt-2" name={ day } isFullWidth onClick={() => this.handleDays(day)} ><Text className="ml-1">{translatedDays[day]}</Text></Checkbox>
        {this.getDisabledSelect(day) && <Select placeholder="Entrada"
          borderless icon={faChevronDown}
          value={this.state.startingDate}
          name={`${ day }sta`} onChange={this.handleChange} options={hourList} />}
        {this.getDisabledSelect(day) && <Select placeholder="Salida"
          borderless icon={faChevronDown}
          value={this.state.finishingDate}
          name={`${ day }fin`} onChange={this.handleChange} options={hourList} />}
        </React.Fragment>
      ))}
      </React.Fragment>)
  }
}

WorkingHoursSelector.PropTypes = {
  startingDate: PropTypes.object,
  finishingDate: PropTypes.object,
  defaultProfessional: PropTypes.object,
  onChange: PropTypes.func,
  validate: PropTypes.func
}

WorkingHoursSelector.defaultProps = {
  startingDate: null,
  finishingDate: null,
  onChange: null,
  validate: null
}

export default WorkingHoursSelector;