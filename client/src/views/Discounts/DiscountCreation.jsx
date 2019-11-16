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

import { ReactComponent as SvgDraw } from '../../assets/undraw_discount_d4bd.svg';

import { DiscountsForm } from '../../components/Discounts';

import { Discount } from '../../models';

import { observer } from 'mobx-react';

import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import { translate } from '../../lib/Translator';

@observer
class DiscountCreation extends Component {

  newDiscount

  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      loaded: false,
      validName: false,
      validDiscount: false,
      validStartingDate: true,
      validEndingDate: true
    }

    this.handleSave   = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.newDiscount = new Discount({}, this.props.store.discounts);
    this.newDiscount._status = 'ok';
    this.setState({
      loaded: true,
    })
  }

  handleChange( name, value, valid ) {
    if(name=='name'){
      this.setState({
        validName: valid.type == 'success',
      })
    }
    else if(name=='discount'){
      this.setState({
        validDiscount: valid.type == 'success',
      })
    } 
    else if(name=='multiplier'){
      this.setState({
        validDiscount: valid,
      })
      name = 'discount'
    } 
    else if(name=='startDate'){
      this.setState({
        validStartingDate: valid,
      })
    } 
    else if(name=='endDate'){
      this.setState({
        validEndingDate: valid,
      })
    }
    else if(name=='type'){
      this.newDiscount['discount'] = ''
    }
    this.newDiscount[name] = value;
  }

  handleSave() {
    const { toastManager } = this.props;
    this.setState({
      isSaving: true,
    }, () => {
      this.newDiscount.status = 'ACTIVE'
      this.newDiscount.save().andThen( (savedDiscount, responseError) => {
        if (responseError) {
          toastManager.add(this.getText('Ups! Parece que hubo un error al guardar!'), {
            appearance: 'error',
            autoDismiss: true,
            pauseOnHover: false,
          });
          this.setState({
            isSaving: false
          })
        }
        else {
          toastManager.add(this.getText('La promoción ha sido creada exitosamente!'), {
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
    return !(this.state.validName && this.state.validDiscount && this.state.validStartingDate && this.state.validEndingDate && this.newDiscount.services.length > 0)
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }
  
  render() {
    if (!this.newDiscount) return null
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>{ this.getText('Nueva promoción') }</Title>
          </LevelLeft>
        </Level>
        <hr/>
        <Columns>
          <Column className="pl-5 pr-5 pt-3" isSize={5}>
            <DiscountsForm discount={ this.newDiscount } onChange={ this.handleChange } />
            <br/>
            <br/>
            { this.state.isSaving ? 
              <Button kind="outline" className="mt-5" disabled pulse icon={ faSpinner }>{ this.getText('Creando..') }</Button> :
              <Button kind="outline" className="mt-5" onClick={ this.handleSave } disabled={ this.getDisabled() }>{ this.getText('Crear promoción') }</Button> }
          </Column>
          <Column isSize={7}>
            <SvgDraw style={{ height: '75%', width: '75%'}}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withToastManager(withStore(withRouter(DiscountCreation)));