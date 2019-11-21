import React, { Component } from 'react';
import { LayoutMenuLinkGroup, LayoutMenuLink } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { 
  faCogs, 
  faDatabase,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";

import { translate } from '../../lib/Translator';

import { observer } from 'mobx-react';

@observer
class ConfigurationMenu extends Component {

  constructor(props) {
    super(props);

    const path = this.props.match.path;

    this.props.store.ui.registerRoute(`${path}/configuration`, 'Configuracíon');
    this.props.store.ui.registerRoute(`${path}/configuration/points`, 'Puntos promocionales');
    this.props.store.ui.registerRoute(`${path}/configuration/data_base`, 'Base de datos');

  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const path = this.props.match.path;
    if (!this.props.store.loggedInUser.canSeePointsConfig() && !this.props.store.loggedInUser.canSeeDBConfig()) return null;
    return(
      <LayoutMenuLinkGroup icon={ faCogs } label={ this.getText('Configuración') } basePath={ `${path}/configuration` }>
        {this.props.store.loggedInUser.canSeePointsConfig() && 
          <LayoutMenuLink icon={ faCoins } to={ `${path}/configuration/points` }>{ this.getText('Puntos promocionales') }</LayoutMenuLink> }
        {this.props.store.loggedInUser.canSeeDBConfig() && 
          <LayoutMenuLink icon={ faDatabase } to={ `${path}/configuration/data_base`  }>{ this.getText('Base de datos') }</LayoutMenuLink> }
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(ConfigurationMenu));