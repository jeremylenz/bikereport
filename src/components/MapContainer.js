import config from '../config'
import React from 'react'
// import Map from './Map.js'
// import GoogleApiComponent from './maps/GoogleApiComponent'
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react'



class MapContainer extends React.Component {

  constructor() {


    super()
    this.state = {
      children: [],
      mapCenter: {
          lat: 40.705503,
          lng: -74.013423
        }
    }
  }



  componentDidMount() {
  }

  componentWillReceiveProps(props) {
    this.setState({
      mapCenter: {lat: props.mapCenter.lat,
      lng: props.mapCenter.lng},
      children: [this.newMarker(props.mapCenter.lat, props.mapCenter.lng)]
    })
    
  }

  mapClicked = (mapProps, map, clickEvent) => {

    this.setState({
      children: [this.newMarker(clickEvent.latLng.lat(), clickEvent.latLng.lng())],
      mapCenter: {lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng()}
    })
  }

  newMarker = (lat,long) => {
    return (
      <Marker title={'hi'}
        name={'Yelstin'}
        key='uggh'
        position={{
            lat: lat,
            lng: long
          }} />
    )
  }

  render() {


      const style = {
        width: '90%',
        height: '90%'
      }




      return (
        <div>
          <Map google={this.props.google}
            style={style}
            zoom={17}
            center={
              {lat: this.state.mapCenter.lat,
               lng: this.state.mapCenter.lng}}
            onClick={this.mapClicked}
            >

          {this.state.children.map((child) => {return child})}

          </Map>
        </div>
      );
    }

  } //END OF class


export default GoogleApiWrapper({
  apiKey: config.GOOGLE_MAPS_API_KEY,
})(MapContainer)
