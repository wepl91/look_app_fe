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

import { ConfirmationModal } from '../../components/ConfirmationModal';

import startCase from 'lodash/startCase';
import { 
    faChevronCircleLeft, 
    faChevronCircleRight, 
    faSpinner, 
    faChevronDown,
    
} from '@fortawesome/free-solid-svg-icons'

import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { translate } from '../../lib/Translator';
@observer
class AppointmentsList extends Component {
    constructor(props) {
        super(props);

        this.chunk                    = this.chunk.bind(this);
        this.handleYear               = this.handleYear.bind(this);
        this.handleMonth              = this.handleMonth.bind(this);
        this.handleReload             = this.handleReload.bind(this);
        this.getDatesInMonth          = this.getDatesInMonth.bind(this);
        this.handleProfessional       = this.handleProfessional.bind(this);

        this.state = {
            appointments: null,
            professionals: null,
            filterProf: 'null',
            showCancelModal: false,
        }
    }

    componentDidMount() {
        const date = moment()
        const datesInMonth = this.getDatesInMonth(date)
        this.setState({
            date: date,
            datesInWeeks: this.chunk(datesInMonth, 7),
            appointments: this.props.store.appointments.search({}, 'appointment-list-view', true),
            professionals: this.props.store.professionals.search({}, 'professional-list-appointment-view', true)
        })
    }

    handleProfessional( sender, value, name ) {
        const searchFilter = value != 'null' ? { professional: value } : {}
        this.setState({
            filterProf: value,
            appointments: this.props.store.appointments.search(searchFilter, 'appointment-list-view', true)
        })
    }

    handleReload() {
        this.setState({
            appointments: this.props.store.appointments.search({}, 'appointment-list-view-reload', true),
        })
    }

    handleMonth(sender, value, name) {
        let newDate = name == 'next' ? moment(this.state.date).add(1, 'months') : moment(this.state.date).subtract(1, 'months')
        const datesInMonth = this.getDatesInMonth(newDate);
        this.setState({
            date: newDate,
            datesInWeeks: this.chunk(datesInMonth, 7)
        })
    }

    handleYear(sender, value, name) {
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
    chunk(arr, size) {
        return arr.reduce((acc, _, i) => (i % size) ? acc : [...acc, arr.slice(i, i + size)], []);
    }

    getDatesInMonth(date) {
        return Array.from({ length: date.daysInMonth() }, (x, i) => moment(date).startOf('month').add(i, 'days'))
    }

    getProfessionalList() {
        const ret = [];
        ret.push({
            key: this.getText('- sin profesional -'),
            value: 'null',
        });
        this.state.professionals.toArray().forEach(prof => {
            ret.push({ key: prof.fullName, value: prof.id })
        });
        return ret;
    }

    getText(text) {
        return translate(text, this.props.store.ui.language)
    }

    renderLoader() {
        return (
            <React.Fragment>
                <Level className="pl-3 pr-3">
                    <LevelLeft style={{ paddingRight: '6px' }}>
                        <Title>{ this.getText('Calendario de turnos') }</Title>
                    </LevelLeft>
                </Level>
                <hr />
                <Columns className="pl-4 pr-3">
                    <Column isSize={3} className="pl-2 pr-2">
                        <Field label={ this.getText('¿Querés ver los turnos de un único profesional?') } labelNote={ this.getText('Selecciona un profesional')}>
                            <Select
                                value={'null'}
                                placeholder={ this.getText('Profesionales') }
                                borderless
                                icon={faChevronDown}
                                loading={!this.state.professionals || !this.state.professionals.isOk()}
                                value={[{key: this.getText('- sin profesional -'),value: 'null',}]}/>
                        </Field>
                    </Column>
                </Columns>
                <Loader icon={faSpinner} label={ this.getText('Cargando los turnos..') } className="fullscreen" />
            </React.Fragment>)
    }

    render() {
        const isAppointmentLoaded = this.state.appointments && this.state.appointments.isOk();
        const isProfessionalsLoaded = this.state.professionals && this.state.professionals.isOk();
        if (!isAppointmentLoaded || !isProfessionalsLoaded) return this.renderLoader();
        return (
            <React.Fragment>
                <Level className="pl-3 pr-3">
                    <LevelLeft style={{ paddingRight: '6px' }}>
                        <Title>{this.getText('Calendario de turnos')}</Title>
                    </LevelLeft>
                </Level>
                <hr />
                <Columns className="pl-4 pr-3">
                    <Column isSize={3} className="pl-2 pr-2">
                        <Field label={ this.getText('¿Querés ver los turnos de un único profesional?') } labelNote={ this.getText('Selecciona un profesional')}>
                            <Select
                                value={this.state.filterProf}
                                key={ this.state.professionals }
                                onChange={ this.handleProfessional }  
                                placeholder={ this.getText('Profesionales') }
                                borderless
                                icon={faChevronDown}
                                loading={!this.state.professionals || !this.state.professionals.isOk()}
                                options={this.state.professionals && this.state.professionals.isOk() && this.getProfessionalList()} />
                        </Field>
                    </Column>
                </Columns>
                <Columns className="is-gapless is-marginless" isVCentered>
                    <Column className="has-text-right">
                        <Button onClick={this.handleYear} name="prev" kind="link"><FontAwesomeIcon icon={faChevronCircleLeft} size="lg" /></Button>
                    </Column>
                    <Column className="has-text-centered" isSize={2}>
                        <Text weight="medium" size="xl" color="primaryDark">{startCase(this.state.date.format('YYYY'))}</Text>
                    </Column>
                    <Column className="has-text-left">
                        <Button onClick={this.handleYear} name="next" kind="link"><FontAwesomeIcon icon={faChevronCircleRight} size="lg" /></Button>
                    </Column>
                </Columns>
                <Columns className="pl-3" isVCentered>
                    <Column className="has-text-left">
                        <Button onClick={this.handleMonth} name="prev" kind="outline">{`${this.getText(startCase(moment(this.state.date).subtract(1, 'months').format('MMMM')))}`}</Button>
                    </Column>
                    <Column className="has-text-centered" isSize={2}>
                        <Text weight="medium" size="xl" color="primaryDark">{this.getText(startCase(this.state.date.format('MMMM')))}</Text>
                    </Column>
                    <Column className="has-text-right pr-4">
                        <Button onClick={this.handleMonth} name="next" kind="outline">{`${this.getText(startCase(moment(this.state.date).add(1, 'months').format('MMMM')))}`}</Button>
                    </Column>
                </Columns>
                <AppointmentCalendar onReload={this.handleReload} key={this.state.datesInWeeks} weeks={this.state.datesInWeeks} appointments={this.state.appointments.toArray()} />
            </React.Fragment>)
    }
}

export default withStore(AppointmentsList);