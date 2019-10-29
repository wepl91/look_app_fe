import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import debounce from 'lodash/debounce';

import { observer } from 'mobx-react';

import { withStore } from '../../hocs';

import {
  Field,
  TextInput,
} from 'shipnow-mercurio';

import {
  Column,
  Columns
} from 'bloomer'

import { translate } from '../../lib/Translator'

@observer
class BranchesForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      street_name: '',
      street_number: '',
      location: '',
      lonlat: {
        lat: null,
        lon: null,
      }
    }

    this.handleChange = this.handleChange.bind(this);

    this.getLanLot = debounce(this.getLanLot.bind(this), 200);

  }

  componentDidUpdate(prevProps, prevState) {
    const diffStreet = prevState.street_name != this.state.street_name;
    const diffNumber = prevState.street_number != this.state.street_number;
    const diffLocation = prevState.location != this.state.location;
    if (diffLocation || diffNumber || diffStreet) {
      this.getLanLot();
    }
  }

  componentDidMount() {
    this.setState({
      loaded: true
    });
  }


  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  getLanLot() {
    if (this.state.street_name == '' || this.state.location == '' || this.state.street_number == '') {
      return;
    }

    const cookedLocation = `${this.state.street_name} ${this.state.street_number}, ${this.state.location}`;
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=1G0vEZOEtXkU5BW9MDLAGp22ATGiUzs8&location=${cookedLocation}`
    let request = {
      'method': 'GET',
      'headers': {},
    };

    fetch(url, request).then(response => {
      return response.json().then(content => {
        const point = {
          lat: content.results[0].locations[0].displayLatLng.lat,
          lon: content.results[0].locations[0].displayLatLng.lng
        }
        this.setState({
          lonlat: point,
        });
      });
    });
  }

  handleChange(sender, value, name, valid) {
    this.setState({
      [name]: value,
    });
  }

  render() {
    const { branch, withMap } = this.props
    const position = this.state.lonlat.lon && this.state.lonlat.lat ? [this.state.lonlat.lat, this.state.lonlat.lon] : [-34.5217483,-58.7029549]
    return (
      <Columns>
        <Column isSize={ 4 }>
          <Field label={ this.getText('Nombre') } labelNote={ this.getText('¿Cuál es el nombre de la nueva sucursal?') }>
            <TextInput value={ branch && branch.name } name="name" onChange={this.handleChange} className="is-fullwidth"/>
          </Field>
          <Field label={ this.getText('Localidad') } labelNote={ this.getText('¿En qué localidad se ubica la nueva sucursal?') }>
            <TextInput value={ branch && branch.location } name="location" onChange={this.handleChange} className="is-fullwidth"/>
          </Field>
          <Field label={ this.getText('Calle') } labelNote={ this.getText('¿Sobre qué calle se encuentra la nueva sucursal?') }>
            <TextInput value={ branch && branch.name } name="street_name" onChange={this.handleChange} className="is-fullwidth"/>
          </Field>
          <Field label={ this.getText('Número') } labelNote="¿A qué altura se encuentra la nueva sucursal?">
            <TextInput name="street_number" onChange={this.handleChange} className="is-fullwidth"/>
          </Field>
        </Column>
        { withMap && 
          <Column isSize={ 6 } className="ml-5 pl-5">
            <Map center={position} zoom={16}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
              <Marker position={position} />
            </Map> 
          </Column> }
      </Columns>)
  }
}

BranchesForm.PropTypes = {
  branch: PropTypes.object,
  withMap: PropTypes.bool,
}

BranchesForm.defaultProps = {
  branch: null,
  withMap: false
}

export default withStore(BranchesForm);