import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faCalendarAlt, faChartBar } from "@fortawesome/free-solid-svg-icons";
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
      <LayoutMenuLinkGroup label="Turnos" basePath={ `${path}/appointments` }>
        <LayoutMenuLink to={ `${path}/appointments/list`   }><FontAwesomeIcon className="mr-2" icon={ faCalendarAlt }/>Listado</LayoutMenuLink>
        <LayoutMenuLink to={ `${path}/appointments/reports`   }><FontAwesomeIcon className="mr-2" icon={ faChartBar }/>Reportes</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(AppointmentsMenu));