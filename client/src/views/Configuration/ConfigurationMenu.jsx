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

  renderLinks() {
    const path = this.props.match.path;
    const ret = [];
    if (this.props.store.loggedInUser.canSeePointsConfig()) {
      ret.push(<LayoutMenuLink key="1" icon={ faCoins } to={ `${path}/configuration/points` }>{ this.getText('Puntos promocionales') }</LayoutMenuLink>)
    }
    if (this.props.store.loggedInUser.canSeeDBConfig()) {
      ret.push(<LayoutMenuLink key="2" icon={ faDatabase } to={ `${path}/configuration/data_base`  }>{ this.getText('Base de datos') }</LayoutMenuLink>)
    }
    return ret;
  }

  render() {
    const path = this.props.match.path;
    
    if (!this.props.store.loggedInUser.canSeePointsConfig() && !this.props.store.loggedInUser.canSeeDBConfig()) return null;
    return(
      <LayoutMenuLinkGroup icon={ faCogs } label={ this.getText('Configuración') } basePath={ `${path}/configuration` }>
        { this.renderLinks() }
      </LayoutMenuLinkGroup> )
  };

}

export default withStore(withRouter(ConfigurationMenu));