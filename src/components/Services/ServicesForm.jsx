import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import {
  Field,
  TextInput,
  Select
} from 'shipnow-mercurio';

class ServicesForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange( sender, value, name, valid ) {
    this.props.onChange && this.props.onChange(name, value, valid);
  }

  render() {
    const priceRegex = /[a-zA-Z]/
    const { service } = this.props
    return(
      <React.Fragment>
        <Field className="pl-5 pr-5" label="¿En cual sucursal querés ofrecer este servicio">
          <Select className="is-fullwidth" icon={ faChevronDown } borderless placeholder="Sucursales"/>
        </Field>
        <Field className="pl-5 pr-5" label="¿Como se llama el servicio que querés ofrecer?">
          <TextInput value={ service && service.name } name="name" className="is-fullwidth" onChange={ this.handleChange }/>
        </Field>
        <Field className="pl-5 pr-5" label="¿Cuanto deseas cobrar por el servicio">
          <TextInput value={ service && service.cost } className="is-fullwidth" validate={ (value) => (!priceRegex.test(value)) } name="cost" onChange={ this.handleChange }/>
        </Field>
        <Field className="pl-5 pr-5" label="¿Cuanto tiempo toma el servicio">
          <TextInput value={ service && service.duration } className="is-fullwidth" name="duration" onChange={ this.handleChange }/>
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

export default ServicesForm;