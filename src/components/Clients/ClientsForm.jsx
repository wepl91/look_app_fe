import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

import { withStore } from '../../hocs';

import {
  Columns,
  Column,
  Checkbox
} from 'bloomer';

import {
  Text,
  TextInput,
  Field
} from 'shipnow-mercurio';

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
    this.props.onChange && this.props.onChange('status', category);
    this.setState({
      clientCategory: category
    })
  }

  handleChange( sender, value, name) {
    this.props.onChange && this.props.onChange(name, value)
  }

  render() {
    const { client } = this.props
    return(
      <React.Fragment>
        <Field label="Nombre y Apellido" labelNote="¿Cómo se llama el nuevo cliente?">
          <Columns>
            <Column>
              <TextInput placeholder="Nombre.." onChange={ this.handleChange } name="name" value={ client.name } className="is-fullwidth" />
            </Column>
            <Column>
              <TextInput placeholder="Apellido.." onChange={ this.handleChange } name="lastName" value={ client.lastName } className="is-fullwidth" />
            </Column>
          </Columns>
        </Field>
        <Field label="Documento" labelNote="¿Cuál es el dni del nuevo cliente?">
          <TextInput onChange={ this.handleChange } name="DNI" value={ client.DNI } className="is-fullwidth" />
        </Field>
        <Field label="Teléfono principal" labelNote="¿Cuál es el nro de teléfono del cliente?">
          <TextInput onChange={ this.handleChange } name="primaryPhone" value={ client.primaryPhone } className="is-fullwidth" />
        </Field>
        <Field label="Teléfono secundario" labelNote="Es necesario una segunda opción de comunicación">
          <TextInput onChange={ this.handleChange } name="secondPhone" value={ client.secondPhone } className="is-fullwidth" />
        </Field>
        <Field label="Categoría" labelNote="¿Dentro de qué categoría se encuentra el cliente?">
          <Text className="ml-1" size="md" weight="medium">
            <input 
              className="ml-1 mr-1" 
              type="radio" 
              value="NORMAL" 
              onChange={ () => (this.handleCategory('NORMAL')) }
              checked={ client.status.name ? client.status.name == 'NORMAL' : client.status == 'NORMAL' } />
            Normal
          </Text>
          <Text className="ml-1 mt-1 mb-1" size="md" weight="medium">
            <input 
              className="ml-1 mr-1" 
              type="radio" 
              value="MOROSO" 
              onChange={ () => (this.handleCategory('MOROSO')) }
              checked={ client.status.name ? client.status.name == 'MOROSO' : client.status == 'MOROSO' } />
            Moroso
          </Text>
          <Text className="ml-1" size="md" weight="medium">
            <input 
              className="ml-1 mr-1" 
              type="radio" 
              value="VIP"
              onChange={ () => (this.handleCategory('VIP')) }
              checked={ client.status.name ? client.status.name == 'VIP' : client.status == 'VIP' } />
            VIP
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

export default ClientsForm;