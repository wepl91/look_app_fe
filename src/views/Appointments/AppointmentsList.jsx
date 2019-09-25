import React, { Component } from 'react';
import { 
    Panel, 
    Text,
    Button,
} from 'shipnow-mercurio';
import moment from 'moment';
import {
    Columns,
    Column,
    Level,
    LevelLeft,
    LevelRight
} from 'bloomer';

import startCase from 'lodash/startCase';

class AppointmentsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: moment(),
        }

        this.handleMonth = this.handleMonth.bind(this);
    }

    handleMonth(sender, value, name) {

    }


    render() {
        /** 
        * chunk => method that "cuts" the array into n arrays of size you want
        */
        const chunk = (arr, size) => arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], []); 
        
        /** 
         *  datesInMonth => get moment() date of all month of state date
        */
        const datesInMonth = Array.from({ length: this.state.date.daysInMonth() }, (x, i) => moment().startOf('month').add(i, 'days'));
        
        /**
         * array of dates of month "cutted" into arrays of seven days (array of array of days of each week of month)
         */
        const datesInWeeks = chunk(datesInMonth, 7)
        return (
            <React.Fragment>
                <br />
                <br />
                <Level>
                    <LevelLeft className="pl-3">
                        <Button value={ moment(this.state.date).subtract(1, 'months') } kind="outline">{ `${ startCase(moment(this.state.date).subtract(1, 'months').format('MMMM')) }` }</Button>
                    </LevelLeft>
                    <LevelRight className="pr-3">
                        <Button value={ moment(this.state.date).add(1, 'months') } kind="outline">{ `${ startCase(moment(this.state.date).add(1, 'months').format('MMMM')) }` }</Button>
                    </LevelRight>
                </Level>
                {datesInWeeks.map(week => (
                    <Columns style={{ marginLeft: '16px' }}>
                        {week.map(day => (
                            <Panel style={{ width: '147px', height: '147px', margin: '8px', padding: '2px' }}>
                                <Text weight="medium">{`${ startCase(day.format('ddd')) } ${ day.format('D') }`}</Text>
                            </Panel>))}
                    </Columns>))}
            </React.Fragment>)
    }
}

export default AppointmentsList;