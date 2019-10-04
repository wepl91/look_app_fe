import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faCut, faPlus } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

class ServicesMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/services`, 'Servicios');
    this.props.store.ui.registerRoute(`${path}/services/list`, 'Listado');

  }

  render() {
    const path = this.props.match.path;

    return(
      <LayoutMenuLinkGroup icon={ faCut } label="Servicios" basePath={ `${path}/services` }>
        <LayoutMenuLink icon={ faCut } to={ `${path}/services/list`  }>Listado</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/services/new`   }>Nuevo servicio</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(ServicesMenu));