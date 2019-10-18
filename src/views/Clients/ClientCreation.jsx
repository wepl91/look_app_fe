import React, { Component } from 'react';

import { withRouter } from 'react-router';
import withStore from '../../hocs/withStore';
import { withToastManager } from 'react-toast-notifications';

import {
  Column,
  Columns,
  Level,
  LevelLeft,
  Checkbox
} from 'bloomer';

import {
  Button,
  Title
} from 'shipnow-mercurio';

import { ReactComponent as SvgDraw } from '../../assets/undraw_personal_info_0okl.svg';

import { ClientsForm } from '../../components/Clients';

import { Client } from '../../models';

import { observer } from 'mobx-react';

import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";

@observer
class ClientCreation extends Component {

  newClient

  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      loaded: false,
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

  handleChange( name, value ) {
    this.newClient[name] = value;
  }

  handleSave() {
    const { toastManager } = this.props;
    this.newClient.status = 'NORMAL';
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

  render() {
    if (!this.newClient) return null
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Nuevo cliente</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column className="pl-5 pr-5 pt-3" isSize={5}>
            <ClientsForm client={ this.newClient } onChange={ this.handleChange } />
            <br/>
            <br/>
            <br/>
            <br/>
            { this.state.isSaving ? 
              <Button kind="outline" className="mt-5" disabled pulse icon={ faSpinner }>Creando..</Button> :
              <Button kind="outline" className="mt-5" onClick={ this.handleSave } >Crear cliente</Button> }
          </Column>
          <Column isSize={7}>
            <SvgDraw style={{ height: '75%', width: '75%'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withToastManager(withStore(withRouter(ClientCreation)));