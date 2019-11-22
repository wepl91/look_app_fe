import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import {
  faChartLine,
  faCut,
  faBriefcase
} from "@fortawesome/free-solid-svg-icons";

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react'

@observer
class ReportsMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/reports`, 'Reportes');
    this.props.store.ui.registerRoute(`${path}/reports/professionals`, 'Profesionales');
    this.props.store.ui.registerRoute(`${path}/reports/services`, 'Servicios');

  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const path = this.props.match.path;
    if (!this.props.store.loggedInUser.canSeeReports()) return null;
    return(
      <LayoutMenuLinkGroup icon={ faChartLine } label={ this.getText('Reportes')    } basePath={ `${path}/reports` }>
        <LayoutMenuLink icon={ faBriefcase } to={ `${path}/reports/professionals`   }>{ this.getText('Profesionales') }</LayoutMenuLink>
        <LayoutMenuLink icon={ faCut } to={ `${path}/reports/services`               }>{ this.getText('Servicios') }</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(ReportsMenu));