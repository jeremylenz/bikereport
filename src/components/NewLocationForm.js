import React from 'react'
import { Form, Button, Icon, Input, Grid, Segment } from 'semantic-ui-react'
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
      currentAddy: '',
      loadingCurrentLocation: false
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
    this.setState({loadingCurrentLocation: true})
    navigator.geolocation.getCurrentPosition((pos) => {
                this.setState({
                  mapCenter: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                  },
                  loadingCurrentLocation: false
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


            <div className='google-map-js'>
              <MapContainer
                mapCenter={this.state.mapCenter}
                />
            </div>




            <Segment.Group horizontal>
              <Segment>

              <Form onSubmit={this.onSubmit}>
                <Form.Field>
                  <Input action='Go' placeholder='Enter location..' value={this.state.text} onChange={this.handleChange} />


                </Form.Field>
              </Form>
            </Segment>

              <Segment>

              {this.state.loadingCurrentLocation && (
              <Button loading size='big' floated='right' />
              )}

              {!this.state.loadingCurrentLocation && (
              <Button onClick={this.getCurrentLocation} floated='right'>
                <Icon name='location arrow' />
              </Button>
              )}
            <Button floated='right'>Save Location</Button>
          </Segment>

        </Segment.Group>

      </div>
    )
  }

}

export default NewLocationForm
