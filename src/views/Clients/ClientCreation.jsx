import React, { Component } from 'react';

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

import { ReactComponent as SvgDraw } from '../../assets/undraw_personal_info_0okl.svg';

import { ClientsForm } from '../../components/Clients';

import { Client } from '../../models';

import { observer } from 'mobx-react';

import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { translate } from '../../lib/Translator';

@observer
class ClientCreation extends Component {

  newClient

  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      loaded: false,
      validName: false,
      validLastName: false,
      validDni: false,
      validPrimaryPhone: false,
      validSecondaryPhone: false
    }

    this.handleSave   = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.newClient = new Client({}, this.props.store.clients);
    this.newClient._status = 'ok';
    this.setState({
      loaded: true,
    })
  }

  handleChange( name, value, valid ) {
    this.newClient[name] = value;
    if(name=='name'){
      this.setState({
        validName: valid.type == 'success',
      })
    }
    else if(name=='lastName'){
      this.setState({
        validLastName: valid.type == 'success',
      })
    } 
    else if(name=='DNI'){
      this.setState({
        validDni: valid.type == 'success',
      })
    } 
    else if(name=='primaryPhone'){
      this.setState({
        validPrimaryPhone: valid.type == 'success',
      })
    } 
    else if(name=='secondPhone'){
      this.setState({
        validSecondaryPhone: valid.type == 'success',
      })
    }
  }

  handleSave() {
    const { toastManager } = this.props;
    this.setState({
      isSaving: true,
    }, () => {
      this.newClient.save().andThen( (savedClient, responseError) => {
        if (responseError) {
          toastManager.add("Ups! Parece que hubo un error al guardar!", {
            appearance: 'error',
            autoDismiss: true,
            pauseOnHover: false,
          });
          this.setState({
            isSaving: false
          })
        }
        else {
          toastManager.add("El cliente ha sido creado exitosamente!", {
            appearance: 'success',
            autoDismiss: true,
            pauseOnHover: false,
          });
          this.props.history.push('list');
        }
      })
    });
  }

  getDisabled() {
    return !(this.state.validName && this.state.validLastName && this.state.validDni && this.state.validPrimaryPhone && this.state.validSecondaryPhone && this.newClient.status !== '')
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }
  
  render() {
    if (!this.newClient) return null
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{ this.getText('Nuevo cliente') }</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column className="pl-5 pr-5 pt-3" isSize={5}>
            <ClientsForm client={ this.newClient } onChange={ this.handleChange } />
            <br/>
            <br/>
            { this.state.isSaving ? 
              <Button kind="outline" className="mt-5" disabled pulse icon={ faSpinner }>{ this.getText('Creando..') }</Button> :
              <Button kind="outline" className="mt-5" onClick={ this.handleSave } disabled={ this.getDisabled() }>{ this.getText('Crear cliente') }</Button> }
          </Column>
          <Column isSize={7}>
            <SvgDraw style={{ height: '75%', width: '75%'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withToastManager(withStore(withRouter(ClientCreation)));