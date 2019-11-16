import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Columns
} from 'bloomer';

import { AppointmentCard } from '.';

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

@observer
class AppointmentCalendar extends Component {
  constructor(props) {
    super(props)

    this.handleReload = this.handleReload.bind(this);
  }

  componentDidMount() {
    this.setState({
      weeks: this.props.weeks
    })    
  }

  handleReload() {
    this.props.onReload && this.props.onReload()
  }
  
  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    if (!this.state) return null;
    const { weeks } = this.state;
    return(
      <React.Fragment>
      { weeks.map(week => (
        <Columns className="ml-3">
            {week.map((day, index) => ( <AppointmentCard key={ day } date={ day } onReload={ this.handleReload } appointments={ this.props.appointments } /> ))}
        </Columns>))}
        <br/>
      </React.Fragment>)
  }
}

AppointmentCalendar.PropTypes = {
  weeks: PropTypes.array,
  appointments: PropTypes.array,
  onReload: PropTypes.func,
}

AppointmentCalendar.defaultProps = {
  weeks: [],
  appointments: null,
  onReload: null,
}

export default withStore(AppointmentCalendar);