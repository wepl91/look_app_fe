import React, { Component } from 'react';

import { withRouter } from 'react-router';
import { withStore } from '../../hocs';
import { withToastManager } from 'react-toast-notifications';

import { observer } from 'mobx-react';

import { translate } from '../../lib/Translator';

import { faSpinner, faCoins } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as SvgDraw } from '../../assets/undraw_discount_d4bd.svg';

import {
  Column,
  Columns,
  Level,
  LevelLeft
} from 'bloomer';

import {
  Title,
  TextInput,
  Field,
  Loader,
  Button,
} from 'shipnow-mercurio';

@observer
class ConfigurationPointsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      changePay: null,
      changePurchase: null,
      disabled: this.getDisabled(),
      isSaving: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSave   = this.handleSave.bind(this);

    this.successToast = this.successToast.bind(this);
    this.errorToast   = this.errorToast.bind(this);
  }

  successToast() {
    const { toastManager } = this.props;
    toastManager.add(this.getText('Los cambios se han guardado exitosamente!'), {
      appearance: 'success',
      autoDismiss: true,
      pauseOnHover: true,
    });
  }

  errorToast() {
    const { toastManager } = this.props;
    toastManager.add(this.getText('Ups! Parece que hubo un error al guardar los datos!'), {
      appearance: 'error',
      autoDismiss: true,
      pauseOnHover: true,
    });
  }

  handleSave() {
    const { toastManager } = this.props;

    this.state.changePay.save().andThen( (savedChangePay, responseError) => {
      if (responseError) {
        this.errorToast();
      }
      else {
        this.state.changePurchase.save().andThen( (savedChagePurchase, responseError) => {
          if (responseError) {
            this.errorToast();
          }
          else {
            this.props.store.ui.getPointsConfig();
            this.successToast();
            this.reload();
          }
        })
      }
    })
  }

  reload() {
    this.setState({
      changePay: this.props.store.configs.get(1),
      changePurchase: this.props.store.configs.get(2),
    })
  }

  handleChange(sender, value, name) {
    const prevState = this.state[name];
    prevState.value = value;
    this.setState({
      [name]: prevState,
    }, () => (
      this.setState({
        disabled: this.getDisabled(),
      })
    ))
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  componentDidMount() {
    this.setState({
      changePay: this.props.store.configs.get(1),
      changePurchase: this.props.store.configs.get(2),
    })
  }

  getDisabled() {
    if (!this.state || !this.state.changePay || !this.state.changePurchase) return true;
    return parseInt(this.state.changePay.value) < 1 || parseInt(this.state.changePurchase.value < 1);
  }

  renderSkeleton() {
    return (
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{this.getText('Configuración de puntos promocionales')}</Title>
          </LevelLeft>
        </Level>
        <hr />
        <Columns>
          <Column isSize={ 4 } className="pt-5 pl-5">
            <Field label={this.getText('Valor de puntos promocionales para pagar')} labelNote={ this.getText('Cantidad de puntos necesarios para representar 1$') }>
              <TextInput
                name="changePurchase"
                disabled
                icon={ faCoins } />
            </Field>
            <Field label={this.getText('Valor de puntos promocionales para asignar')} labelNote={ this.getText('Cantidad de puntos necesarios para representar 1$') }>
              <TextInput
                name="changePay"
                disabled
                icon={ faCoins }/> 
            </Field>
            <br />
            <br />
            <Button 
              onClick={ this.handleSave }
              className="mt-5"
              kind="outline"
              disabled>
                { this.getText('Guardar') }
            </Button>
          </Column>
          <Column isSize={ 8 }>
            <SvgDraw style={{width: '40%', position: 'absolute', right: '12.5%', top:'-15%'}}/>
          </Column>
        </Columns>
      </React.Fragment>)
  }


  render() {
    const isChangePayLoaded = this.state.changePay && this.state.changePay.isOk();
    const isChangePurchaseLoaded = this.state.changePurchase && this.state.changePurchase.isOk();
    
    if (!isChangePayLoaded || !isChangePurchaseLoaded) {
      return this.renderSkeleton()
    }

    return (
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{this.getText('Configuración de puntos promocionales')}</Title>
          </LevelLeft>
        </Level>
        <hr />
        <Columns>
          <Column isSize={ 4 } className="pt-5 pl-5">
            <Field label={this.getText('Valor de puntos promocionales para pagar')} labelNote={ this.getText('Cantidad de puntos necesarios para representar 1$') }>
              <TextInput
                name="changePurchase"
                onChange={ this.handleChange }
                icon={ faCoins } 
                value={ this.state.changePurchase.value }
                validate={ value => (value > 0) }/>
            </Field>
            <Field label={this.getText('Valor de puntos promocionales para asignar')} labelNote={ this.getText('Cantidad de puntos necesarios para representar 1$') }>
              <TextInput
                name="changePay"
                onChange={ this.handleChange }
                icon={ faCoins }
                value={ this.state.changePay.value }
                validate={ value => (value > 0) }/> 
            </Field>
            <br />
            <br />
            { !this.state.isSaving ? 
            <Button 
              onClick={ this.handleSave }
              className="mt-5"
              kind="outline"
              disabled={ this.state.disabled }>
                { this.getText('Guardar') }
            </Button> :
            <Button icon={ faSpinner } pulse disabled>{ this.getText('Guardando..') }</Button> }
          </Column>
          <Column isSize={ 8 }>
            <SvgDraw style={{width: '40%', position: 'absolute', right: '12.5%', top:'-15%'}}/>
          </Column>
        </Columns>
      </React.Fragment>)
  }
}

export default withToastManager(withStore(withRouter(ConfigurationPointsView)));