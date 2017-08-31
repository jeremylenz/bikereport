import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import MapContainer from './MapContainer.js'
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react'
import config from '../config.js'
// import Mapbox from './Mapbox'




class NewLocationForm extends React.Component {

  constructor () {
    super ()
    this.state = {
      text: '',
      mapCenter: {
          lat: 40.705503,
          lng: -74.013423
        },
      currentAddy: ''
    }
  }


  componentDidMount () {
  }

  onSubmit = () => {
    let geoQuery = this.state.text
    this.setState({text: ''})
    geoQuery = encodeURI(geoQuery)
    const GEO_CODE_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${geoQuery}&key=${config.GOOGLE_MAPS_API_KEY}`
    this.findAddress(GEO_CODE_URL)
  }

  handleChange = (event) => {
    this.setState({
      text: event.target.value
    })
  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
            console.log(pos)
                this.setState({
                  mapCenter: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                  }
                })})
  }

  findAddress = (GEO_CODE_URL) => {
    fetch(GEO_CODE_URL)
    .then(resp => resp.json())
    .then(resp => this.processLocation(resp))
  }

  processLocation = (results) => {
    console.log(results.results[0].formatted_address)
    let location = results.results[0].geometry.location
    this.setState({
      mapCenter: location
    })
  }



  render () {
    return (
      <div className="put-it-in-a-div">
        <Button onClick={this.getCurrentLocation}>Current Location</Button>
        <div>
          <MapContainer
            mapCenter={this.state.mapCenter}
            />
        </div>
        <div>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <input placeholder='Enter location..' value={this.state.text} onChange={this.handleChange} />
          </Form.Field>
          <Button type='submit'>Go</Button>
        </Form>
      </div>
      </div>
    )
  }

}

export default NewLocationForm
