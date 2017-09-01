import React from 'react'
import config from '../config.js'
import { Form, Grid, Dropdown, Header } from 'semantic-ui-react'


class NewReportForm extends React.Component {

  constructor() {
    super ()

    let typeOptions = ['']

    this.state = {
      bikePathsLoaded: false,
      locationsLoaded: false,
      bikePaths: [],
      locations: [],
      bikePathOptions: [],
      locationOptions: []

    }
  }

  render () {
    return (
      <div className="put-it-in-a-div">
        <Grid centered columns={2}>
          <Grid.Column>
            <Form>
              <Header as='h3'>New Report</Header>
              <label htmlFor='bikepath'>Bike path:</label>
              <Form.Dropdown placeholder='Bike path: ' id='bikepath' options={this.state.bikePathOptions} />
              <label htmlFor='location'>Location:</label>
              <Form.Dropdown placeholder='Location: ' id='location' options={this.state.locationOptions} />


            </Form>
          </Grid.Column>
        </Grid>



      </div>
    )
  }

  componentDidMount() {
    fetch(`${config.OUR_API_URL}/bike_paths`)
    .then(resp => resp.json())
    .then((resp) => this.loadBikePaths(resp))
    .then(() => fetch(`${config.OUR_API_URL}/locations`))
    .then((resp) => resp.json())
    .then((resp) => this.loadLocations(resp))
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

  loadLocations = (resp) => {
    let locationOptions = resp.map((location) => {
      return {key: location.id,
              value: location.name,
              text: location.name}
    })
    this.setState({
      locationsLoaded: true,
      locationOptions: locationOptions,
      locations: resp
    })
  }


}

export default NewReportForm
