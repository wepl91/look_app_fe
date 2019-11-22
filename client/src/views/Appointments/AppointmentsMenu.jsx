import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faCalendarAlt, faChartBar, faPlus } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react'

@observer
class AppointmentsMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/appointments`, 'Turnos');
    this.props.store.ui.registerRoute(`${path}/apointments/list`, 'Listado');
    this.props.store.ui.registerRoute(`${path}/apointments/reports`, 'Reportes');

  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const path = this.props.match.path;
    if (!this.props.store.loggedInUser.canSeeAppointments()) return null;
    return(
      <LayoutMenuLinkGroup icon={ faCalendarAlt } label={ this.getText('Turnos') } basePath={ `${path}/appointments` }>
        <LayoutMenuLink icon={ faCalendarAlt } to={ `${path}/appointments/list`   }>{ this.getText('Listado') }</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/appointments/new`           }>{ this.getText('Nuevo turno') }</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(AppointmentsMenu));