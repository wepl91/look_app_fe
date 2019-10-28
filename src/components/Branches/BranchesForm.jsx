import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { GoogleMap, Marker, withGoogleMap, withScriptjs } from "react-google-maps"

import { observer } from 'mobx-react';

import { withStore } from '../../hocs';

import {
  Field,
  TextInput,
} from 'shipnow-mercurio';

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
    
    this.getLanLot = this.getLanLot.bind(this);
  
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
    })
  }
  

  getText( text ) {
    return translate(text, this.props.store.ui.language)
  }

  getLanLot() {
    console.dir(this.state)
    if (this.state.street_name == '' || this.state.location == '' || this.state.street_number == '') {
      return;
    }

    const cookedLocation = `${ this.state.street_name } ${ this.state.street_number }, ${ this.state.location }`;
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=1G0vEZOEtXkU5BW9MDLAGp22ATGiUzs8&location=${ cookedLocation }`
    let request = {
      'method': 'GET',
      'headers': {},
    };

    fetch(url, request).then(response => {
      return response.json().then( content => {
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

  handleChange( sender, value, name, valid ) {
    this.setState({
      [name]: value,
    });
  }

  render() {
    const { branch } = this.props
    const MapWithAMarker = withScriptjs(withGoogleMap((props =>
      <GoogleMap 
          defaultZoom={16} 
          defaultCenter={{ lat: props.lat, lng: props.lng }}>
          <Marker position={{ lat: props.lat, lng: props.lng }} />
      </GoogleMap> )))
    return(
      <React.Fragment>
        <Field label="Nombre" labelNote="¿Cuál es el nombre de la nueva sucursal?">
          <TextInput name="name" onChange={ this.handleChange } />
        </Field>
        <Field label="Localidad" labelNote="¿En qué localidad se ubica la nueva sucursal?">
          <TextInput name="location" onChange={ this.handleChange } />
        </Field>
        <Field label="Calle" labelNote="¿Sobre qué calle se encuentra la nueva sucursal?">
          <TextInput name="street_name" onChange={ this.handleChange } />
        </Field>
        <Field label="Número" labelNote="¿A qué altura se encuentra la nueva sucursal?">
          <TextInput name="street_number" onChange={ this.handleChange } />
        </Field>
        { this.state.lonlat.lat && this.state.lonlat.lon &&
          <MapWithAMarker 
            key={ this.state.lonlat }
            lat={ this.state.lonlat.lat }
            lng={ this.state.lonlat.lon }
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `300px`, width: `410px` }} />}
            mapElement={<div style={{ height: `100%` }} />} />  }
      </React.Fragment>)
  }
}

BranchesForm.PropTypes = {
  branch: PropTypes.object,
}

BranchesForm.defaultProps = {
  branch: null,
} 

export default withStore(BranchesForm);