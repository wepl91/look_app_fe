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

    this.getLanLot = debounce(this.getLanLot.bind(this), 400);

  }

  componentDidMount() {
    if (this.props.branch) {
      this.getLanLot(this.props.branch);
    }
    this.setState({
      loaded: true
    });
  }


  getText(text) {
    return translate(text, this.props.store.ui.language)
  }

  getLanLot(branch = null) {
    const street_name = branch ? branch.street_name : this.state.street_name;
    const street_number = branch ? branch.street_number : this.state.street_number;
    const location = branch ? branch.location : this.state.location;
    if (street_name == '' || location == '' || street_number == '') {
      return;
    }

    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=1G0vEZOEtXkU5BW9MDLAGp22ATGiUzs8&street=${ street_number }+${ street_name.replace(' ', '+') }&city=${ location.replace(' ', '+') }&country=Argentina,`
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
    }, () => {
      this.getLanLot();
    });
    this.props.onChange && this.props.onChange(name, value);
  }

  render() {
    const { branch, withMap } = this.props
    const position = this.state.lonlat.lat && this.state.lonlat.lon ? [this.state.lonlat.lat, this.state.lonlat.lon] : null;
    return (
      <Columns>
        <Column isSize={ 4 } className="ml-5">
          <Field label={ this.getText('Nombre') } labelNote={ this.getText('¿Cuál es el nombre de la nueva sucursal?') }>
            <TextInput value={ branch && branch.name } name="name" onChange={this.handleChange} className="is-fullwidth"/>
          </Field>
          <Field label={ this.getText('Localidad') } labelNote={ this.getText('¿En qué localidad se ubica la nueva sucursal?') }>
            <TextInput value={ branch && branch.location } name="location" onChange={this.handleChange} className="is-fullwidth"/>
          </Field>
          <Field label={ this.getText('Calle') } labelNote={ this.getText('¿Sobre qué calle se encuentra la nueva sucursal?') }>
            <TextInput value={ branch && branch.street_name } name="street_name" onChange={this.handleChange} className="is-fullwidth"/>
          </Field>
          <Field label={ this.getText('Número') } labelNote="¿A qué altura se encuentra la nueva sucursal?">
            <TextInput value={ branch && branch.street_number } name="street_number" onChange={this.handleChange} className="is-fullwidth"/>
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
  onChange: PropTypes.func,
}

BranchesForm.defaultProps = {
  branch: null,
  withMap: false,
  onChange: null,
}

export default withStore(BranchesForm);