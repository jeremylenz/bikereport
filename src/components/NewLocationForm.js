import React from 'react'
import { Form, Button, Icon, Input, Segment, Modal, Header, Dropdown, Search } from 'semantic-ui-react'
import MapContainer from './MapContainer.js'
import NavBar from './NavBar'
// import {Map, Marker, GoogleApiWrapper} from 'google-maps-react'
import config from '../config.js'
// import Mapbox from './Mapbox'
import { Redirect } from 'react-router-dom'

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
      bikePathSearchResults: [],
      bikePathsLoaded: false,
      bikePaths: [],
      bikePathMenuOpen: false,
      saveStatus: 'waiting',
      locationId: null,
      goBack: false,
      redirectToNewReportForm: false
    }
  }


  componentDidMount () {
    fetch(`${config.OUR_API_URL}/bike_paths`)
    .then(resp => resp.json())
    .then((resp) => this.loadBikePaths(resp))
  }

  pluralize(number, string) {
    if(number === 1) {
      return `${number} ${string}`
    } else {
      return `${number} ${string}s`
    }
  }



  loadBikePaths = (resp) => {
    let bikePathOptions = resp.map((bikePath) => {
      return {id: bikePath.id,
              title: bikePath.name,
              description: `${this.pluralize(bikePath.reports_count, 'report')}, ${this.pluralize(bikePath.locations_count, 'location')}`
            }
    })
    this.setState({
      bikePathsLoaded: true,
      bikePathOptions: bikePathOptions,
      bikePathSearchResults: bikePathOptions,
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

  handleBikePathDDChange = (event) => {
    let bikePaths = this.state.bikePathOptions
    let searchQuery = event.target.value
    let lcSearchQuery = searchQuery.toLowerCase()
    this.setState({
      bikePathInput: searchQuery,
      bikePathSearchResults: bikePaths.filter((bp) => {return bp.title.toLowerCase().includes(lcSearchQuery)})
    })
  }

  handleBikePathResultSelect = (event, data) => {
    this.setState({
      bikePathInput: data.result.title
    })
  }

  findOrCreate = (bikePathName) => {
    if(this.state.bikePathsLoaded === false) {
      console.error('bike paths not loaded')
      return null
    }
    let result = this.state.bikePaths.find((bikePath) => {
      return bikePath.name === bikePathName
    })
    if(typeof result === 'undefined') {
      return this.createNewBikePath(bikePathName)
    } else {
      console.log('found bike path: ', result)
      this.setState({
        selectedBikePathId: result.id,
        bikePathInput: result.name
      }, this.saveLocation)
      return Promise.resolve(result)
    }
  }

  createNewBikePath = (bikePathName) => {
    console.log('creating new bikePath...')
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')
    myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jwt'))

    let myBody =
    {"bike_path": {
                  "name": bikePathName
                  }
    }

    return fetch(`${OUR_API_URL}/bike_paths`,
      {method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(myBody)
    })
    .then(resp => resp.json())
    .then((resp) => {console.log(resp);
      this.setState({bikePaths: [resp, ...this.state.bikePaths],
      selectedBikePathId: resp.id, bikePathInput: resp.name}, this.saveLocation)
    })

  }

  clearBikePathInput = () => {
    this.setState({
      bikePathInput: ''
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
    // navigator.geolocation.getCurrentPosition(getCoor, errorCoor, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

    navigator.geolocation.getCurrentPosition((pos) => {

                this.setState({
                  mapCenter: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                  },
                  loadingCurrentLocation: false
                })}, null, {maximumAge: 60000, timeout: 5000, enableHighAccuracy: true})
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

  prepareSave = () => {
    this.findOrCreate(this.state.bikePathInput)


  }

  saveLocation = () => {

    this.setState({
      saveStatus: 'saving'
    })
    console.log(this.state.currentMarker)
    let newLocationName = this.state.locationNameInput
    let bikePathName = this.state.bikePathInput
    let bikePathId = this.state.selectedBikePathId

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')
    myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jwt'))


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
    .then(resp => this.setState({
      saveStatus: 'saved',
      locationId: resp.id,
    }, this.proceedToNewReport))
  }

  updateMarker = (mapCenter) => {
    this.setState({
      currentMarker: mapCenter
    })
    // console.log(mapCenter)
  }

  goBack = () => {
    this.setState({
      goBack: true
    })
  }

  proceedToNewReport = () => {
    setTimeout(() => {this.setState({
      redirectToNewReportForm: true
    })}, 1000)

  }







  render () {

    if(this.state.goBack === true) {
      return (
        <Redirect to={'/main'} />
      )
    }

    if(this.state.redirectToNewReportForm) {
      return (
        <Redirect to={`/newreport/${this.state.locationId}/${this.props.match.params.report_type}`} />
      )
    }

    return (

      <div className="put-it-in-a-div">

            <NavBar />
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
                  <Input action='Go' placeholder={'Enter address (optional)..'} value={this.state.text} onChange={this.handleChange} />

                </Form.Field>
              </Form>
            </Segment>

              <Segment>
                <Button floated='left' basic icon='cancel' color='red' onClick={this.goBack}/>

              {this.state.loadingCurrentLocation && (
              <Button loading size='huge' floated='right' />
              )}

              {!this.state.loadingCurrentLocation && (
              <Button onClick={this.getCurrentLocation} floated='right'>
                <Icon name='location arrow' />
              </Button>
              )}


              <Modal
              trigger={<Button floated='right' onClick={this.handleOpen} primary disabled={!this.state.bikePathsLoaded}>Set Location</Button>}
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
                  <Form.Field>
                    <label>On a bike lane or path?   (type to search, or create new)</label>
                  </Form.Field>
                  <Form.Field>

                  <Search
                    icon='bicycle'
                    value={this.state.bikePathInput}
                    results={this.state.bikePathSearchResults}
                    onSearchChange={this.handleBikePathDDChange}
                    onResultSelect={this.handleBikePathResultSelect}
                    showNoResults={false}
                  >
                  </Search>
                </Form.Field>
                  {this.state.saveStatus === 'waiting' &&
                  <Button type='submit' onClick={this.prepareSave}>Save</Button>
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
