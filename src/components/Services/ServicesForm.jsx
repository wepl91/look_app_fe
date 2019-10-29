import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { priceRegex, nameRegex } from '../../lib/Regex'

import {
  Field,
  TextInput,
  Select
} from 'shipnow-mercurio';

import { withStore } from '../../hocs';

import { translate } from '../../lib/Translator';

@observer
class ServicesForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange( sender, value, name, valid ) {
    this.props.onChange && this.props.onChange(name, value, valid);
  }

  handleSelect( value ) {
  }

  getDurationOptions() {
    return([
      {
        key: '30',
        value: '30',
      },
      {
        key: '60',
        value: '60',
      },
      {
        key: '90',
        value: '90',
      },
      {
        key: '120',
        value: '120',
      }
    ])
  }

  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const { service } = this.props
    return(
      <React.Fragment>
        <Field className="pl-5 pr-5" label={ this.getText('¿En cuál sucursal querés ofrecer este servicio?') }>
          <Select className="is-fullwidth" icon={ faChevronDown } borderless placeholder={ this.getText('Sucursales') } />
        </Field>
        <Field className="pl-5 pr-5" label={ this.getText('¿Cómo se llama el servicio que querés ofrecer?') }>
          <TextInput value={ service && service.name } name="name" className="is-fullwidth" validate={ (value) => (nameRegex.test(value)) } onChange={ this.handleChange }/>
        </Field>
        <Field className="pl-5 pr-5" label={ this.getText('¿Cuánto deseas cobrar por el servicio') }>
          <TextInput value={ service && service.price } className="is-fullwidth" validate={ (value) => (priceRegex.test(value)) } name="cost" onChange={ this.handleChange }/>
        </Field>
        <Field className="pl-5 pr-5" label={ this.getText('¿Cuánto tiempo toma el servicio?') }>
          <Select name="duration" className="is-fullwidth" value={ service && service.duration } onChange={ this.handleChange } options={ this.getDurationOptions() } icon={ faChevronDown } borderless placeholder={ this.getText('Minutos') }/>
        </Field>
      </React.Fragment> )
  }
}

ServicesForm.PropTypes = {
  onChange: PropTypes.func,
  service : PropTypes.object,
}

ServicesForm.defaultProps = {
  onChange: null,
  service : null,
}

export default withStore(ServicesForm);