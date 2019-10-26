import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

import { withStore } from '../../hocs';

import { nameRegex, dniRegex, phoneRegex } from '../../lib/Regex'

import {
  Columns,
  Column
} from 'bloomer';

import {
  Text,
  TextInput,
  Field
} from 'shipnow-mercurio';

import { translate } from '../../lib/Translator';

@observer
class ClientsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientCategory: this.props.client.status.name || this.props.client.status,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleCategory( category ) {
    this.props.onChange && this.props.onChange('status', category, true);
    this.setState({
      clientCategory: category
    })
  }

  handleChange( sender, value, name, valid) {
    this.props.onChange && this.props.onChange(name, value, valid)
  }

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  render() {
    const { client } = this.props
    return(
      <React.Fragment>
        <Field label={ this.getText('Nombre y Apellido') } labelNote={ this.getText('¿Cómo se llama el nuevo cliente?') }>
          <Columns>
            <Column>
              <TextInput placeholder={ this.getText('Nombre') } onChange={ this.handleChange } validate={ (value) => (nameRegex.test(value)) } name="name" value={ client.name } className="is-fullwidth" />
            </Column>
            <Column>
              <TextInput placeholder={ this.getText('Apellido') } onChange={ this.handleChange } validate={ (value) => (nameRegex.test(value)) } name="lastName" value={ client.lastName } className="is-fullwidth" />
            </Column>
          </Columns>
        </Field>
        <Field label={ this.getText('Documento') } labelNote="¿Cuál es el dni del nuevo cliente?">
          <TextInput placeholder="11.111.111" onChange={ this.handleChange } name="DNI" validate={ (value) => (dniRegex.test(value)) } value={ client.DNI } className="is-fullwidth" />
        </Field>
        <Field label="Email" labelNote={ this.getText('¿Cuál es el email del nuevo cliente?') }>
          <TextInput name="" placeholder="cliente@gmail.com" onChange={ this.handleChange } />
        </Field>
        <Field label={ this.getText('Teléfono principal') } labelNote={ this.getText('¿Cuál es el nro de teléfono del cliente?') }>
          <TextInput onChange={ this.handleChange } name="primaryPhone" validate={ (value) => (phoneRegex.test(value)) } value={ client.primaryPhone } className="is-fullwidth" />
        </Field>
        <Field label={ this.getText('Teléfono secundario') } labelNote={ this.getText('Es necesario una segunda opción de comunicación') }>
          <TextInput onChange={ this.handleChange } name="secondPhone" validate={ (value) => (phoneRegex.test(value)) } value={ client.secondPhone } className="is-fullwidth" />
        </Field>
        <Field label={ this.getText('Categoría') } labelNote={ this.getText('¿Dentro de qué categoría se encuentra el cliente?') }>
          <Text className="ml-1" size="md" weight="medium">
            <input 
              className="ml-1 mr-1" 
              type="radio" 
              value="NORMAL" 
              onChange={ () => (this.handleCategory('NORMAL')) }
              checked={ client.status.name ? client.status.name == 'NORMAL' : client.status == 'NORMAL' } />
            { this.getText('Normal') }
          </Text>
          <Text className="ml-1 mt-1 mb-1" size="md" weight="medium">
            <input 
              className="ml-1 mr-1" 
              type="radio" 
              value="MOROSO" 
              onChange={ () => (this.handleCategory('MOROSO')) }
              checked={ client.status.name ? client.status.name == 'MOROSO' : client.status == 'MOROSO' } />
            { this.getText('Moroso') }
          </Text>
          <Text className="ml-1" size="md" weight="medium">
            <input 
              className="ml-1 mr-1" 
              type="radio" 
              value="VIP"
              onChange={ () => (this.handleCategory('VIP')) }
              checked={ client.status.name ? client.status.name == 'VIP' : client.status == 'VIP' } />
            { this.getText('VIP') }
          </Text>
        </Field>
      </React.Fragment> );
  }
}

ClientsForm.PropTypes = {
  client: PropTypes.object,
  onChange: PropTypes.func,
}

ClientsForm.defaultProps = {
  client: null,
  onChange: null,
}

export default withStore(ClientsForm);