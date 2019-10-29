import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router';
import withStore from '../../hocs/withStore';
import { withToastManager } from 'react-toast-notifications';

import {
  Column,
  Columns,
  Level,
  LevelLeft
} from 'bloomer';

import {
  Button,
  Title
} from 'shipnow-mercurio';

import { ReactComponent as SvgDraw } from '../../assets/undraw_business_shop_qw5t.svg';

import { Branch } from '../../models';

import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { translate } from '../../lib/Translator';

import { BranchesForm } from '../../components/Branches';

@observer
class BranchCreation extends Component {

  newBranch

  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
    }

    this.handleSave = this.handleSave.bind(this);
  } 

  componentDidMount(){
    this.newBranch = new Branch({}, this.props.store.branches);
    this.newBranch._status = 'ok';
    this.setState({
      loaded: true,
    })
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  getDisabled() {
    return false
  }

  handleSave() {

  }

  render() {
    if (!this.newBranch) return null
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{ this.getText('Nueva sucursal') }</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column className="pl-5 pr-5 pt-3">

            <BranchesForm withMap/>
            { this.state.isSaving ? 
              <Button kind="outline" className="mt-5" disabled pulse icon={ faSpinner }>{ this.getText('Creando..') }</Button> :
              <Button kind="outline" className="mt-5" onClick={ this.handleSave } disabled={ this.getDisabled() }>{ this.getText('Crear sucursal') }</Button> }
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withToastManager(withStore(withRouter(BranchCreation)));
