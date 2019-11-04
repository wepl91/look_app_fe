import React, { Component } from 'react';
import { withRouter } from 'react-router';

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

import { ReactComponent as SvgDraw } from '../../assets/undraw_online_cv_qy9w.svg';

import { ProfessionalsForm } from '../../components/Professionals/';

import { withToastManager } from 'react-toast-notifications';
import withStore from '../../hocs/withStore';


import { Professional } from '../../models';
import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator'; 

@observer
class ProfessionalCreation extends Component {

  newProfessional

  constructor(props) {
    super(props);

    this.state = {
      validName: false,
      validLastName: false,
      validPhone: false,
      validMail: false,
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
        toastManager.add( this.getText('Ups! Parece que hubo un error al guardar!'), {
          appearance: 'error',
          autoDismiss: true,
          pauseOnHover: false,
        });
      }
      else {
        toastManager.add(this.getText('El profesional fue agregado exitosamente!'), {
          appearance: 'success',
          autoDismiss: true,
          pauseOnHover: false,
        });
        this.props.history.push('list');
      }
    })
  }

  handleChange( name, value, valid ) {
    const professional = this.getProfessional();
    if (name == 'name') {
      this.setState({
        validName: valid.type == 'success',
      })
    } 
    else if(name == 'lastName'){
      this.setState({
        validLastName: valid.type == 'success',
      })
    } 
    else if(name=='phone'){
      this.setState({
        validPhone: valid.type == 'success',
      })
    } 
    else if(name=='email'){
      this.setState({
        validMail: valid.type == 'success',
      })
    } 
    else if(name == 'services'){
      this.setState({
        validServices: valid,
      })
    } 
    if(name == 'hours'){
      professional.workingHours = value
      this.setState({
        validHours: valid,
      })
    }
    else{
      professional[name] = value;
      this.setState( prevState => ({
        reload: !prevState.reload
      }))
    }
  }

  getDisabled() {
    return !(this.state.validName && this.state.validLastName && this.state.validPhone && this.state.validMail && this.state.validServices && this.state.validHours)
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
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
            <Title>{ this.getText('Nuevo profesional') }</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column className="pr-4" isSize={6}>
            <ProfessionalsForm onChange={ this.handleChange } />
            <br/>
            <br/>
            <br/>
            <Button onClick={ this.handleClick } className="ml-4" kind="outline" disabled={ this.getDisabled() }>{ this.getText('Agregar profesional') }</Button>
          </Column>
          <Column isSize={6}>
            <SvgDraw className={"has-text-centered"} style={{ height: '600px', width: '700px'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withToastManager(withStore(withRouter(ProfessionalCreation)));