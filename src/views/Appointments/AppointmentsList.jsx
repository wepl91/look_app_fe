import React, { Component } from 'react';
import { 
    Button,
    Text,
    Title
} from 'shipnow-mercurio';
import moment from 'moment';

import {
    Columns,
    Column,
    Level,
    LevelLeft,
    LevelRight
} from 'bloomer';

import { AppointmentCalendar } from '../../components/Appointments';

import startCase from 'lodash/startCase';

import {faChevronCircleLeft, faChevronCircleRight} from '@fortawesome/free-solid-svg-icons'
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

class AppointmentsList extends Component {
    constructor(props) {
        super(props);

        this.getDatesInMonth = this.getDatesInMonth.bind(this);
        this.chunk = this.chunk.bind(this);
        this.handleMonth = this.handleMonth.bind(this);
        this.handleYear = this.handleYear.bind(this);
    }

    
    componentDidMount() {
        const date = moment()
        const datesInMonth = this.getDatesInMonth(date)
        
        this.setState({
            date: date,
            datesInWeeks: this.chunk(datesInMonth, 7)

        })
    }

    handleMonth( sender, value, name ) {
        let newDate = name == 'next' ? moment(this.state.date).add(1, 'months') : moment(this.state.date).subtract(1, 'months')
        const datesInMonth = this.getDatesInMonth(newDate);
        debugger
        this.setState({
            date: newDate,
            datesInWeeks: this.chunk(datesInMonth, 7)
        })
    }

    handleYear( sender, value, name ) {
        let newDate = name == 'next' ? moment(this.state.date).add(1, 'years') : moment(this.state.date).subtract(1, 'years')
        const datesInMonth = this.getDatesInMonth(newDate);
        debugger
        this.setState({
            date: newDate,
            datesInWeeks: this.chunk(datesInMonth, 7)
        })
    }

    /** 
    * chunk => method that "cuts" the array into n arrays of size you want
    */
    chunk( arr, size ) {
        return arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], []);
    } 
    
    getDatesInMonth( date ) {
        return Array.from({ length: date.daysInMonth() }, (x, i) => moment(date).startOf('month').add(i, 'days'))
    }

    render() {
        if (!this.state) return null
        return (
            <React.Fragment key={ this.state.datesInWeeks }>
                <Level className="pl-3 pr-3">
                    <LevelLeft style={{ paddingRight: '6px' }}>
                        <Title>Calendario de turnos</Title>
                    </LevelLeft>
                    <LevelRight></LevelRight>
                </Level>
                <hr />
                <Columns className="is-gapless is-marginless" isVCentered>
                    <Column className="has-text-right">
                        <Button onClick={ this.handleYear } name="prev" kind="link"><FontAwesomeIcon icon={ faChevronCircleLeft } size="lg"/></Button>
                    </Column>
                    <Column className="has-text-centered" isSize={ 2 }>
                        <Text weight="medium" size="xl" color="primaryDark">{ startCase(this.state.date.format('YYYY')) }</Text>
                    </Column>
                    <Column className="has-text-left">
                        <Button onClick={ this.handleYear } name="next" kind="link"><FontAwesomeIcon icon={ faChevronCircleRight } size="lg"/></Button>
                    </Column>
                </Columns>
                <Columns className="pl-3 pr-4" isVCentered>
                    <Column className="has-text-left">
                        <Button onClick={ this.handleMonth } name="prev" kind="outline">{ `${ startCase(moment(this.state.date).subtract(1, 'months').format('MMMM')) }` }</Button>
                    </Column>
                    <Column className="has-text-centered" isSize={ 2 }>
                        <Text weight="medium" size="xl" color="primaryDark">{ startCase(this.state.date.format('MMMM')) }</Text>
                    </Column>
                    <Column className="has-text-right" style={{ paddingRight: '2px' }}>
                        <Button onClick={ this.handleMonth } name="next" kind="outline">{ `${ startCase(moment(this.state.date).add(1, 'months').format('MMMM')) }` }</Button>
                    </Column>
                </Columns>
                <AppointmentCalendar key={ this.state.datesInWeeks } weeks={ this.state.datesInWeeks }/>
            </React.Fragment>)
    }
}

export default AppointmentsList;