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

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { ReactComponent as SvgDraw } from '../../assets/undraw_barber_3uel.svg';

import withStore from '../../hocs/withStore';

import { Service } from '../../models';

import { observer } from 'mobx-react';
@observer
class ServiceCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cost: '',
      buttonDisabled: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const service = new Service({}, this.props.store.services);
    service.name = this.state.name;
    service.cost = this.state.cost;
    service.duration = this.state.duration;
    
    service.save().andThen( (savedService, responseError) => {
      if (responseError) {

      }
      else {
        alert("Se creo todo!")
      }
    })
  }

  handleChange( sender, value, name, valid ) {
    if (name == 'cost') {
      this.setState({
        cost: value,
        buttonDisabled: valid.type == 'error',
      })
    }
    else {
      this.setState({
        [name]: value,
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
        <hr/>
        <Columns>
          <Column className="pl-5 pr-5">
            <Field className="pl-5 pr-5" label="¿En cual sucursal querés ofrecer este servicio">
              <Select className="is-fullwidth" icon={ faChevronDown } borderless placeholder="Sucursales"/>
            </Field>
            <Field className="pl-5 pr-5" label="¿Como se llama el servicio que querés ofrecer?">
              <TextInput name="name" className="is-fullwidth" onChange={ this.handleChange }/>
            </Field>
            <Field className="pl-5 pr-5" label="¿Cuanto deseas cobrar por el servicio">
              <TextInput className="is-fullwidth"
                         value={ this.state.price } 
                         validate={ (value) => (!priceRegex.test(value)) } name="cost" onChange={ this.handleChange }/>
            </Field>
            <Field className="pl-5 pr-5" label="¿Cuanto tiempo toma el servicio">
              <TextInput className="is-fullwidth"
                         value={ this.state.price } 
                         name="duration" onChange={ this.handleChange }/>
            </Field>
            <br/>
            <br/>
            <br/>
            <br/>
            <Button onClick={ this.handleClick } className="ml-5" kind="outline">Crear servicio</Button>
          </Column>
          <Column>
          <SvgDraw style={{ height: '300px', width: '400px', marginTop: '-50px' }}/>
          </Column>
        </Columns>
      </React.Fragment> )
  }
}

export default withStore(ServiceCreation);