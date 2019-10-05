import React, { Component } from 'react';

import {
  Column,
  Columns,
  Level,
  LevelLeft,
} from 'bloomer';

import {
  Button,
  Title,
} from 'shipnow-mercurio';

import { ServicesForm } from '../../components/Services';

import { withToastManager } from 'react-toast-notifications';
import withStore from '../../hocs/withStore';
import { withRouter } from 'react-router';

import { ReactComponent as SvgDraw } from '../../assets/undraw_barber_3uel.svg';

import { Service } from '../../models';
import { observer } from 'mobx-react';

@observer
class ServiceCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cost: '',
      buttonDisabled: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { toastManager } = this.props;
    const service = new Service({}, this.props.store.services);
    service.name = this.state.name;
    service.cost = this.state.cost;
    service.duration = this.state.duration;
    
    service.save().andThen( (savedService, responseError) => {
      if (responseError) {
        toastManager.add("Ups! Parece que hubo un error al guardar los datos!", {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: true,
        });
      }
      else {
        toastManager.add("Los cambios se han guardado exitosamente!", {
          appearance: 'success',
          autoDismiss: true,
          pauseOnHover: true,
        });
        this.props.history.push('services/list')
      }
    })
  }

  handleChange( name, value, valid ) {
    if (name == 'cost') {
      this.setState({
        cost: value,
        buttonDisabled: valid.type == 'error',
      })
    }
    else {
      this.setState({
        [name]: value,
      })
    } 
  }

  getDisabled() {
    if (this.state.buttonDisabled) {
      return false;
    }

    if (this.state.cost == '' || this.state.duration == '' || this.state.name == '') {
      return false;
    }

    return true;
  }


  render() {
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Nuevo servicio</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column className="pl-5 pr-5">
            <ServicesForm onChange={ this.handleChange } />
            <br/>
            <br/>
            <br/>
            <br/>
            <Button onClick={ this.handleClick } className="ml-5" kind="outline" disabled={ !this.getDisabled() }>Crear servicio</Button>
          </Column>
          <Column>
          <SvgDraw style={{ height: '300px', width: '400px', marginTop: '-10px' }}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

ServiceCreation.Proptype

export default withToastManager(withStore(withRouter(ServiceCreation)));