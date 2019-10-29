import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Columns, Column
} from 'bloomer';

import { Checkbox } from '../../components/Checkbox'

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

  isDaySelected(day){
    return (day in this.state.days)
  }

  getBeginHour( day ){
    return this.state.days[day]['sta']
  }

  getEndHour( day ){
    return this.state.days[day]['fin']
  }

  render() {
    const { className } = this.props;
    let hourList = this.hoursBetweenDates(this.props.startingDate, this.props.finishingDate)
    let daysList = this.props.days
    const translatedDays = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
    }
    //style={{ maxHeight: '5vh', width: '300px' }}
    return (
      <React.Fragment>
      {daysList.map(day => (
        <Columns isGapless isMarginless isVCentered isCentered className={ className }>
          <Column>
            <Checkbox className={'pt-2'} name={ day } onCheck={() => this.handleDays(day)} checked={this.props.defaultProfessional && day in this.props.defaultProfessional.rawWorkingDays} >{translatedDays[day]}</Checkbox>
          </Column>
          <Column>
            {this.isDaySelected(day) && <Select placeholder="Entrada"
              borderless icon={faChevronDown} className={'mt-2'}
              value={ this.getBeginHour(day) } 
              name={`${ day }sta`} onChange={this.handleChange} options={hourList} />}
          </Column>
          <Column>
            {this.isDaySelected(day) && <Select placeholder="Salida"
              borderless icon={faChevronDown} className={'mt-2'}
              value={ this.getEndHour(day) }
              name={`${ day }fin`} onChange={this.handleChange} options={hourList} />}
           </Column>
        </Columns>
      ))}
      </React.Fragment>)
  }
}

WorkingHoursSelector.PropTypes = {
  className: PropTypes.string,
  startingDate: PropTypes.object,
  finishingDate: PropTypes.object,
  defaultProfessional: PropTypes.object,
  onChange: PropTypes.func,
  validate: PropTypes.func
}

WorkingHoursSelector.defaultProps = {
  className: PropTypes.string,
  startingDate: null,
  finishingDate: null,
  defaultProfessional: null,
  onChange: null,
  validate: null
}

export default WorkingHoursSelector;