import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faCalendarAlt, faChartBar, faPlus } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

class AppointmentsMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/appointments`, 'Turnos');
    this.props.store.ui.registerRoute(`${path}/apointments/list`, 'Listado');
    this.props.store.ui.registerRoute(`${path}/apointments/reports`, 'Reportes');

  }

  render() {
    const path = this.props.match.path;

    return(
      <LayoutMenuLinkGroup icon={ faCalendarAlt } label="Turnos" basePath={ `${path}/appointments` }>
        <LayoutMenuLink icon={ faCalendarAlt } to={ `${path}/appointments/list`   }>Listado</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/appointments/new`           }>Nuevo turno</LayoutMenuLink>
        <LayoutMenuLink icon={ faChartBar } to={ `${path}/appointments/reports`   }>Reportes</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(AppointmentsMenu));