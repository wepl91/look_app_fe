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
      <LayoutMenuLinkGroup label="Servicios" basePath={ `${path}/services` }>
        <LayoutMenuLink to={ `${path}/services/list`  }><FontAwesomeIcon className="mr-2" icon={ faCut }/>Listado</LayoutMenuLink>
        <LayoutMenuLink to={ `${path}/services/new`   }><FontAwesomeIcon className="mr-2" icon={ faPlus }/>Nuevo servicio</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(ServicesMenu));