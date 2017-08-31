import config from '../config'
import React from 'react'
import Map from './Map.js'
import GoogleApiComponent from './maps/GoogleApiComponent'


export class MapContainer extends React.Component {

  render() {


      const style = {
        width: '100vw',
        height: '100vh'
      }



      return (
        <Map google={this.props.google}
          zoom={17}
          style={style}
          initialCenter={{
              lat: 40.7047078,
              lng: -74.0174336
            }}
          >

        </Map>
      );
    }

  } //END OF class


export default GoogleApiComponent({
  apiKey: config.GOOGLE_MAPS_API_KEY
})(MapContainer)
