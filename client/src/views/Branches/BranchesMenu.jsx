import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { faStoreAlt, faChartBar, faPlus } from "@fortawesome/free-solid-svg-icons";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react';

@observer
class BranchesMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/branches`, 'Sucursales');
    this.props.store.ui.registerRoute(`${path}/branches/list`, 'Listado');

  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const path = this.props.match.path;

    return(
      <LayoutMenuLinkGroup icon={ faStoreAlt } label={ this.getText('Sucursales') } basePath={ `${path}/branches` }>
        <LayoutMenuLink icon={ faStoreAlt } to={ `${path}/branches/list`   }>{ this.getText('Listado') }</LayoutMenuLink>
        <LayoutMenuLink icon={ faPlus } to={ `${path}/branches/new`        }>{ this.getText('Nueva sucursal') }</LayoutMenuLink>
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(BranchesMenu));