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
    this.handleChange = this.handleChange.bind(this);
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

  handleSave() {
    const { toastManager } = this.props;
    this.setState({
      isSaving: true,
    }, () => {
      this.newBranch.save().andThen( (savedBranch, responseError) => {
        if (responseError) {
          toastManager.add(this.getText('Ups! Parece que hubo un error al guardar!'), {
            appearance: 'error',
            autoDismiss: true,
            pauseOnHover: false,
          });
          this.setState({
            isSaving: false
          });
        }
        else {
          toastManager.add(this.getText('La sucursal ha sido creado exitosamente!'), {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
          this.props.history.push('list');
        }
      })
    })
  }

  handleChange(name, value) {
    this.newBranch[name] = value;
    this.setState( prevState => ({
      loaded: !prevState.loaded,
    }))
  }

  getDisabled() {
    return !this.newBranch.name || !this.newBranch.street_name || !this.newBranch.street_number || !this.newBranch.location;
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
            <BranchesForm withMap branche={ this.newBranch } onChange={ this.handleChange }/>
            { this.state.isSaving ? 
              <Button kind="outline" className="mt-5 ml-5" disabled pulse icon={ faSpinner }>{ this.getText('Creando..') }</Button> :
              <Button kind="outline" className="mt-5 ml-5" onClick={ this.handleSave } disabled={ this.getDisabled() }>{ this.getText('Crear sucursal') }</Button> }
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withToastManager(withStore(withRouter(BranchCreation)));
