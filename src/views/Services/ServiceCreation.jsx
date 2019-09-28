import React, { Component } from 'react';

import {
  Column,
  Columns,
  Level,
  LevelLeft,
  LevelRight
} from 'bloomer';

import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
  Select,
  Field,
  TextInput,
  Title
} from 'shipnow-mercurio';

import { ReactComponent as SvgDraw } from '../../assets/undraw_barber_3uel.svg';

class ServiceCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      price: '',
      buttonDisabled: false,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange( sender, value, name, valid ) {
    if (name == 'price') {
      this.setState({
        price: value,
        buttonDisabled: valid.type == 'error',
      })
    }
  }

  render() {
    const priceRegex = /[a-zA-Z]/
    return(
      <React.Fragment>
        <Level>
          <LevelLeft>
            <Title>Nuevo servicio</Title>
          </LevelLeft>
        </Level>
        <Columns>
          <Column className="pl-5 pr-5">
            <Field className="pl-5 pr-5" label="¿En cual sucursal querés ofrecer este servicio">
              <Select className="is-fullwidth" />
            </Field>
            <Field className="pl-5 pr-5" label="¿Como se llama el servicio que querés ofrecer?">
              <TextInput className="is-fullwidth" />
            </Field>
            <Field className="pl-5 pr-5" label="¿Cuanto deseas cobrar por el servicio">
              <TextInput className="is-fullwidth"
                         value={ this.state.price } 
                         validate={ (value) => (!priceRegex.test(value)) } name="price" onChange={ this.handleChange }/>
            </Field>
            <br/>
            <br/>
            <br/>
            <br/>
            <Button className="ml-5" kind="outline">Crear servicio</Button>
          </Column>
          <Column>
          <SvgDraw style={{ height: '300px', width: '400px', marginTop: '-50px' }}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default ServiceCreation;