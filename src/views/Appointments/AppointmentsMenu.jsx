import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

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
      <LayoutMenuLinkGroup label="Turnos" basePath={ `${path}/appointments/` }>
        <LayoutMenuLink to={ `${path}/appointments/list`   }>Listado</LayoutMenuLink>
        <LayoutMenuLink to={ `${path}/appointments/reports`   }>Reportes</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(AppointmentsMenu));