import React, { Component } from 'react';

import { Panel, TextInput, Text, Button, Img, Form } from 'shipnow-mercurio';

import withStore from '../../hocs/withStore';

import { LevelLeft, LevelRight, Level, Column, Columns } from 'bloomer';

class SignIn extends Component {
  insecure
  constructor(props) {
    super(props);

    this.state = {
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSignIn      = this.handleSignIn.bind(this);
    this.handleClick       = this.handleClick.bind(this);
    this.signIn            = this.signIn.bind(this);
    this.logIn             = this.logIn.bind(this);
  }

  handleSignIn() {
    this.setState({ signingIn: true });

    this.logIn()
  }

  logIn() {
    this.setState({ signingIn: true });

    this.props.store.signIn( this.state.user, this.state.password )
      .then( res => {
        // do nothing.... mobx does the magic :)
      })
      .catch( err => {
        this.setState({ 
          signingIn: false,
          signingError: err.response || err.toString(),
        });
      });
  }

  signIn(sender, formData) {
    if (this.props.params && this.props.params.on_boarded && this.props.params.on_boarded == 'false') {
      //here render onBoarding page
      this.checkAuth().then(res => {
        this.setState({
          onBoarding: true,
        })
      }, err => {
        this.setState({ 
          signingIn: false,
          signingError: err.response || err.toString(),
        });
      })
    }
    else {
      this.logIn()
    }
  }

  handleInputChange(sender, value, name, valid, securityLevel) {
    if(value != '') {
      let newState = {};
      newState[name] = value;
      if(securityLevel && securityLevel >= 2 && this.state.insecure) {
        this.insecure = false
      }
      this.setState(newState);

    }
  }

  handleClick( sender, value, name ) {
    
  }

  verifyPassword() {
    const password = this.state.password;
    return (/[a-zA-Z]/.test(password) && password.length >= 8 && /\d/.test(password))
  }

  renderSignInView() {
    return (
      <Panel level="2">
        <Text lead size="md">Bienvenido</Text>
        <Text>Iniciá sesión para acceder a LookApp</Text>
          <Form onSubmit={ this.signIn }>
          <TextInput name="user" 
                     size="lg" 
                     icon="user" 
                     placeholder="Email" 
                     className="is-fullwidth mt-4 mb-1" 
                     value={ this.state.user }
                     disabled={ this.state.signingIn }
                     onChange={ this.handleInputChange } />
          <TextInput name="password" 
                     size="lg" 
                     icon="lock" 
                     placeholder="Contraseña" 
                     type="password" 
                     className="is-fullwidth my-1" 
                     value={ this.state.password }
                     disabled={ this.state.signingIn }
                     onChange={ this.handleInputChange } />
          { this.state.signingError && 
            <Panel color="error" className="mt-2" invert>
              <Text multiline>No se pudo iniciar sesión. ¿Estás seguro de haber puesto correctamente los datos?</Text>
            </Panel> }
          { !this.state.signingIn ?
            <Button size="xl" 
                    className="is-fullwidth mt-4 mb-2" 
                    isDefault
                    kind="outline"
                    name="signIn"
                    onClick={ this.handleClick }>
                    Iniciar sesión
            </Button> :
            <Button size="xl" 
                    className="is-fullwidth mt-4 mb-2" 
                    icon="spinner" pulse 
                    disabled /> }
            <Level>
              <LevelLeft>
              <Button onClick={ this.handleClick }
                        className="mr-4 mt-1"
                        kind="link"
                        name="createAccount">
                        Crear cuenta
                </Button> 
              </LevelLeft>
              <LevelRight>
                <Button onClick={ this.handleRecoverPassword } kind="link" className="is-fullwidth mt-1">¿Olvidaste tu contraseña?</Button>
              </LevelRight>
            </Level>
        </Form>
      </Panel> );
  }

  render() {
    return this.renderSignInView()
  }

}

export default withStore(SignIn);