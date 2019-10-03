import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Columns
} from 'bloomer';

import { AppointmentCard } from '.';
 
class AppointmentCalendar extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.setState({
      weeks: this.props.weeks
    })    
  }
  

  render() {
    if (!this.state) return null;
    const { weeks } = this.state;
    console.dir(weeks)
    return(
      <React.Fragment>
      { weeks.map(week => (
        <Columns className="ml-3">
            {week.map((day, index) => ( <AppointmentCard key={ day } date={ day }/> ))}
        </Columns>))}
        <br/>
      </React.Fragment>)
  }
}

AppointmentCalendar.PropTypes = {
  weeks: PropTypes.array,
}

AppointmentCalendar.defaultProps = {
  weeks: [],
}

export default AppointmentCalendar;