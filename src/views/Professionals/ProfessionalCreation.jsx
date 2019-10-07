import React, { Component } from 'react';

import {
  Column,
  Columns,
  Level,
  LevelLeft,
  Checkbox
} from 'bloomer';

import {
  Button,
  Select,
  Field,
  TextInput,
  Title,
  Text,
  Panel
} from 'shipnow-mercurio';

import { ReactComponent as SvgDraw } from '../../assets/undraw_online_cv_qy9w.svg';
import moment from 'moment';
import { ProfessionalsForm } from '../../components/Professionals/';

import { withToastManager } from 'react-toast-notifications';

import withStore from '../../hocs/withStore';

import { Professional } from '../../models';
import { observer } from 'mobx-react';

@observer
class ProfessionalCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonDisabled: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { toastManager } = this.props;
    const professional = new Professional({}, this.props.store.professionals);
    professional.name = this.state.name;
    professional.lastName = this.state.lastName;
    professional.phone = this.state.phone;
    professional.email = this.state.email;
/*     professional.services = this.state.services; */
    
    professional.save().andThen( (savedProfessional, responseError) => {
      if (responseError) {
        toastManager.add("Ups! Parece que hubo un error al guardar!", {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
      else {
        toastManager.add("Los cambios se han guardado exitosamente!", {
          appearance: 'success',
          autoDismiss: true,
          pauseOnHover: false,
        })
      }
    })
  }

  handleChange( name, value, valid ) {
    if(name == 'hours'){
      this.setState({
        startingTime: value[0],
        finishingTime: value[1],
        buttonDisabled: valid,
      })
    }
    this.setState({
      [name]: value,
    })
  }

  render() {
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Nuevo profesional</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column className="pl-5 pr-5" isSize={5}>
            <ProfessionalsForm onChange={ this.handleChange } />
            <br/>
            <br/>
            <br/>
            <br/>
            <Button onClick={ this.handleClick } className="ml-5" kind="outline" disabled={this.state.buttonDisabled}>Agregar profesional</Button>
          </Column>
          <Column isSize={7}>
            <SvgDraw style={{ height: '75%', width: '75%'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withToastManager(withStore(ProfessionalCreation));