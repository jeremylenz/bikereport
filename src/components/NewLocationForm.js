import React from 'react'
import { Form, Button, Icon, Input, Segment, Modal, Header, Dropdown } from 'semantic-ui-react'
import MapContainer from './MapContainer.js'
// import {Map, Marker, GoogleApiWrapper} from 'google-maps-react'
import config from '../config.js'
// import Mapbox from './Mapbox'

const OUR_API_URL = config.OUR_API_URL

class NewLocationForm extends React.Component {

  constructor () {
    super ()
    this.state = {
      text: '',
      mapCenter: {lat: 40.705503, lng: -74.013423},
      currentMarker: {lat: 40.705503, lng: -74.013423},
      currentAddy: '',
      loadingCurrentLocation: false,
      modalOpen: false,
      locationNameInput: '',
      bikePathInput: 'None',
      bikePathOptions: [],
      bikePathsLoaded: false,
      bikePaths: [],
      saveStatus: 'waiting'
    }
  }


  componentDidMount () {
    fetch(`${config.OUR_API_URL}/bike_paths`)
    .then(resp => resp.json())
    .then((resp) => this.loadBikePaths(resp))
  }



  loadBikePaths = (resp) => {
    let bikePathOptions = resp.map((bikePath) => {
      return {key: bikePath.id,
              value: bikePath.name,
              text: bikePath.name}
    })
    this.setState({
      bikePathsLoaded: true,
      bikePathOptions: bikePathOptions,
      bikePaths: resp
    })
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

  handleFormChange = (event) => {
    this.setState({
      locationNameInput: event.target.value
    })
  }

  handleFormChangeBikePath = (event) => {
    // console.log(event.target.children[0].innerText)
    // this.setState({
    //   bikePathInput: event.target.children[0].innerText
    // })
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
      mapCenter: location,
      currentMarker: location
    })
  }

  handleOpen = () => this.setState({ modalOpen: true})

  handleClose = () => this.setState({ modalOpen: false, saveStatus: 'waiting' })

  saveLocation = (event) => {
    this.setState({
      saveStatus: 'saving'
    })
    console.log(this.state.currentMarker)
    let newLocationName = this.state.locationNameInput
    let bikePathName = event.target.parentElement.children[1].children[1].innerText
    let bikePathId = this.state.bikePaths.find((bikePath) => {return bikePath.name === bikePathName}).id

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')

    let myBody =
    {"location": {
                  "name": newLocationName,
                  "lat": this.state.currentMarker.lat,
                  "long": this.state.currentMarker.lng
                  },
      "bike_path": {
                  "id": bikePathId
                  }
    }

    fetch(`${OUR_API_URL}/locations`,
      {method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(myBody)
    })
    .then(resp => resp.json())
    .then(this.setState({
      saveStatus: 'saved'
    }))
  }

  updateMarker = (mapCenter) => {
    this.setState({
      currentMarker: mapCenter
    })
    console.log(mapCenter)
  }







  render () {
    return (
      <div className="put-it-in-a-div">


            <div className='google-map-js'>
              <MapContainer
                mapCenter={this.state.mapCenter}
                updateMarker={this.updateMarker}
                />
            </div>




            <Segment.Group horizontal>
              <Segment>

              <Form onSubmit={this.onSubmit}>
                <Form.Field>
                  <Input action='Go' placeholder='Enter address (optional)..' value={this.state.text} onChange={this.handleChange} />


                </Form.Field>
              </Form>
            </Segment>

              <Segment>

              {this.state.loadingCurrentLocation && (
              <Button loading size='huge' floated='right' />
              )}

              {!this.state.loadingCurrentLocation && (
              <Button onClick={this.getCurrentLocation} floated='right'>
                <Icon name='location arrow' />
              </Button>
              )}


              <Modal
              trigger={<Button floated='right' onClick={this.handleOpen} disabled={!this.state.bikePathsLoaded}>Save Location</Button>}
              open={this.state.modalOpen}
              onClose={this.handleClose}
              dimmer='inverted'
              basic
              size='small'
              closeIcon='close'
            >
              <Header icon='crosshairs' content='Save Location' />
              <Modal.Content>
                <Form>
                  <Form.Field>
                    <label>Location name: </label>
                    <input placeholder='Describe the location' value={this.locationNameInput} onChange={this.handleFormChange}/>
                  </Form.Field>
                  <Dropdown placeholder='On a bike lane or path?'
                    fluid search selection
                    options={this.state.bikePathOptions}
                    />
                  {this.state.saveStatus === 'waiting' &&
                  <Button type='submit' onClick={this.saveLocation}>Save</Button>
                  }
                  {this.state.saveStatus === 'saving' &&
                  <Button type='submit' loading primary>Saving...</Button>
                  }
                  {this.state.saveStatus === 'saved' &&
                  <Button type='submit' color='green' disabled>
                    <Icon name='checkmark'/>Saved!</Button>
                  }

                </Form>
              </Modal.Content>
              <Modal.Actions>
                {this.state.saveStatus === 'waiting' &&
                <Button onClick={this.handleClose} color='red' inverted>
                  <Icon name='remove'/> Cancel
                </Button>
                }
                {this.state.saveStatus === 'saved' &&
                <Button onClick={this.handleClose} color='green' inverted>
                  <Icon name='checkmark'/> Done
                </Button>
                }

              </Modal.Actions>
            </Modal>

          </Segment>

        </Segment.Group>


      </div>
    )
  }

}

export default NewLocationForm
