import React, { Component } from 'react';

import withStore from '../../hocs/withStore';

import { observer } from 'mobx-react';

import { ReactComponent as SvgDraw } from '../../assets/undraw_landing_page_q6hh.svg';

import {
  Level,
  LevelLeft,
} from 'bloomer';

import { Title } from 'shipnow-mercurio';

import { translate } from '../../lib/Translator.js';

@observer
class Home extends Component {
  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }
  render() {
    const styleSVG = {
      width: '100%',
      position: 'absolute',
      top: '-100px',
      zIndex: 0,
    }
    return( 
      <React.Fragment>
        <Level>
          <LevelLeft>
            <div style={{ zIndex: '1' }}>
              <Title>{ `${ this.getText('Bienvenido') } ${ this.props.store.loggedInUser.cookedFullName }!  ;)` }</Title>
            </div>
          </LevelLeft>
        </Level>
        <SvgDraw style={ styleSVG } /> 
      </React.Fragment> )
  }
}

export default withStore(Home)