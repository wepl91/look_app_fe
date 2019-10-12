import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { 
    Button,
    Text,
    Title,
    Loader,
    Field,
    Select,
} from 'shipnow-mercurio';
import moment from 'moment';

import {
    Columns,
    Column,
    Level,
    LevelLeft,
    LevelRight
} from 'bloomer';

import { withStore } from '../../hocs'

import { AppointmentCalendar } from '../../components/Appointments';

import startCase from 'lodash/startCase';
import {faChevronCircleLeft, faChevronCircleRight, faSpinner, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
@observer
class AppointmentsList extends Component {
    constructor(props) {
        super(props);

        this.getDatesInMonth = this.getDatesInMonth.bind(this);
        this.chunk = this.chunk.bind(this);
        this.handleMonth = this.handleMonth.bind(this);
        this.handleYear = this.handleYear.bind(this);

        this.state = {
            appointments: null,
            professionals: null,
            filterProf: 0,
        }
    }

    
    componentDidMount() {
        const date = moment()
        const datesInMonth = this.getDatesInMonth(date)
        this.setState({
            date: date,
            datesInWeeks: this.chunk(datesInMonth, 7),
            appointments: this.props.store.appointments.search({ }, 'appointment-list-view', true),
            professionals: this.props.store.professionals.search({}, 'professional-list-appointment-view', true)
        })
    }

    handleMonth( sender, value, name ) {
        let newDate = name == 'next' ? moment(this.state.date).add(1, 'months') : moment(this.state.date).subtract(1, 'months')
        const datesInMonth = this.getDatesInMonth(newDate);
        this.setState({
            date: newDate,
            datesInWeeks: this.chunk(datesInMonth, 7)
        })
    }

    handleYear( sender, value, name ) {
        let newDate = name == 'next' ? moment(this.state.date).add(1, 'years') : moment(this.state.date).subtract(1, 'years')
        const datesInMonth = this.getDatesInMonth(newDate);
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

    getProfessionalList() {
        const ret = [];
        this.state.professionals.toArray().forEach(prof => {
            ret.push({key: prof.fullName, value: prof.id})
        });
        return ret;
    }

    render() {
        const isAppointmentLoaded = this.state.appointments && this.state.appointments.isOk();
        const isProfessionalsLoaded = this.state.professionals && this.state.professionals.isOk();
        if (!isAppointmentLoaded || !isProfessionalsLoaded) return <Loader icon={ faSpinner } label="Cargando los turnos.." className="fullscreen" />     
        return (
            <React.Fragment key={ this.state.datesInWeeks }>
                <Level className="pl-3 pr-3">
                    <LevelLeft style={{ paddingRight: '6px' }}>
                        <Title>Calendario de turnos</Title>
                    </LevelLeft>
                    <LevelRight></LevelRight>
                </Level>
                <hr />
                <Columns className="pl-4 pr-3">
                    <Column isSize={ 3 } className="pl-2 pr-2">
                        <Field label="¿Querés filtrar los tunos?" labelNote="Filtra por profesionales">
                            <Select 
                                value={ this.state.professionals && this.state.professionals.isOk() ? this.state.filterProf : null }
                                placeholder="Profesionales" 
                                borderless 
                                icon={ faChevronDown } 
                                loading={ !this.state.professionals || !this.state.professionals.isOk() }
                                options={ this.state.professionals && this.state.professionals.isOk() && this.getProfessionalList() } />
                        </Field>
                    </Column>
                </Columns>
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
                <Columns className="pl-3" isVCentered>
                    <Column className="has-text-left">
                        <Button onClick={ this.handleMonth } name="prev" kind="outline">{ `${ startCase(moment(this.state.date).subtract(1, 'months').format('MMMM')) }` }</Button>
                    </Column>
                    <Column className="has-text-centered" isSize={ 2 }>
                        <Text weight="medium" size="xl" color="primaryDark">{ startCase(this.state.date.format('MMMM')) }</Text>
                    </Column>
                    <Column className="has-text-right pr-4">
                        <Button onClick={ this.handleMonth } name="next" kind="outline">{ `${ startCase(moment(this.state.date).add(1, 'months').format('MMMM')) }` }</Button>
                    </Column>
                </Columns>
                <AppointmentCalendar key={ this.state.datesInWeeks } weeks={ this.state.datesInWeeks } appointments={ this.state.appointments.toArray() } />
            </React.Fragment>)
    }
}

export default withStore(AppointmentsList);