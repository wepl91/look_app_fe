import React, { Component } from 'react';
import { withRouter } from 'react-router';

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

import { ProfessionalsForm } from '../../components/Professionals/';

import { withToastManager } from 'react-toast-notifications';

import withStore from '../../hocs/withStore';

import { Professional, Service } from '../../models';
import { observer } from 'mobx-react';

@observer
class ProfessionalCreation extends Component {

  newProfessional

  constructor(props) {
    super(props);

    this.state = {
      validServices: false,
      validHours: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    this.newProfessional = this.getProfessional();
  }

  handleClick() {
    const { toastManager } = this.props;
    const professional = this.getProfessional();
    professional.status = 'ACTIVE';

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
        });
        this.props.history.push('professionals/list');
      }
    })
  }

  handleChange( name, value, valid ) {
    const professional = this.getProfessional();
    if(name == 'services'){
      this.setState({
        validServices: valid,
      })
    }
    if(name == 'hours'){
      professional.workingHours = value
      this.setState({
        validHours: valid,
      })
    }else{
      professional[name] = value;
      this.setState( prevState => ({
        reload: !prevState.reload
      }))
    }
  }

  getDisabled() {
    const professional = this.getProfessional();
    if (!this.state.validServices || !this.state.validHours) {
      return true;
    }
    if (professional.name == '') {
      return true;
    }

    return false;
  }

  getProfessional() {
    if (this.newProfessional) {
      return this.newProfessional;
    }
    else if (this.props.professional){
      this.newProfessional = this.props.professional.clone();
      return this.newProfessional;
    }else{
      this.newProfessional = new Professional({}, this.props.store.professionals);
      return this.newProfessional;
    }
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
            <Button onClick={ this.handleClick } className="ml-5" kind="outline" disabled={this.getDisabled()}>Agregar profesional</Button>
          </Column>
          <Column isSize={7}>
            <SvgDraw style={{ height: '75%', width: '75%'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withToastManager(withStore(withRouter(ProfessionalCreation)));