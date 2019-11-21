import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faPlus, faBriefcase } from "@fortawesome/free-solid-svg-icons";

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react'

@observer
class ProfessionalsMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/professionals`, 'Profesionales');
    this.props.store.ui.registerRoute(`${path}/professionals/list`, 'Listado');

  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const path = this.props.match.path;
    if (!this.props.store.loggedInUser.canSeeProffesionals()) return null;
    return(
      <LayoutMenuLinkGroup icon={ faBriefcase } label={ this.getText('Profesionales') } basePath={ `${path}/professionals` }>
        <LayoutMenuLink icon={ faBriefcase } to={ `${path}/professionals/list`  }>{ this.getText('Listado') }</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/professionals/new`   }>{ this.getText('Nuevo profesional') }</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(ProfessionalsMenu));