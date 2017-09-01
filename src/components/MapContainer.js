import config from '../config'
import React from 'react'
// import Map from './Map.js'
// import GoogleApiComponent from './maps/GoogleApiComponent'
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react'



class MapContainer extends React.Component {

  constructor(props) {


    super(props)
    this.state = {
      children: [],
      mapCenter: props.mapCenter
      // {lat: 37.705503, lng: -74.013423}
    }
  }



  componentDidMount() {
  }



  componentWillReceiveProps(props) {

    if((props.mapCenter.lat !== this.props.mapCenter.lat) || (props.mapCenter.lng !== this.props.mapCenter.lng)){

      this.setState({
        children: [this.newMarker(props.mapCenter.lat, props.mapCenter.lng)],
        mapCenter: props.mapCenter
      })
    }


  }

  mapClicked = (mapProps, map, clickEvent) => {
    let newMapCenter = {lat: clickEvent.latLng.lat(),
    lng: clickEvent.latLng.lng()}
    this.setState({
      children: [this.newMarker(clickEvent.latLng.lat(), clickEvent.latLng.lng())],
      mapCenter: newMapCenter
    }, () => this.props.updateMarker(this.state.mapCenter))
    // () => this.props.updateMarker(this.state.mapCenter)


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

  componentDidUpdate(prevProps, prevState) {
    // console.log('didUpdate ', this.state.mapCenter)
  }



  render() {


      const style = {
        width: '100%',
        height: '100vh'
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
