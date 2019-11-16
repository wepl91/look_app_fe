import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { withStore } from '../../hocs';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

import {
  Column,
  Columns,
  Level,
  LevelLeft
} from 'bloomer';

import {
  Title,
  Select,
  Field,
  DateTimePicker,
} from 'shipnow-mercurio';

@observer
class ConfigurationDBView extends Component {
  constructor(props) {
    super(props);
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    return (
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{this.getText('Configuración de base de datos')}</Title>
          </LevelLeft>
        </Level>
        <hr />
      </React.Fragment>)
  }
}

export default withStore(withRouter(ConfigurationDBView));