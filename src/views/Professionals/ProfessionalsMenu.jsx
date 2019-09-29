import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faCut, faPlus, faBriefcase } from "@fortawesome/free-solid-svg-icons";

class ProfessionalsMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/professionals`, 'Profesionales');
    this.props.store.ui.registerRoute(`${path}/professionals/list`, 'Listado');

  }

  render() {
    const path = this.props.match.path;

    return(
      <LayoutMenuLinkGroup icon={ faBriefcase } label="Profesionales" basePath={ `${path}/professionals` }>
        <LayoutMenuLink icon={ faBriefcase } to={ `${path}/professionals/list`  }>Listado</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/professionals/new`   }>Nuevo profesional</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(ProfessionalsMenu));