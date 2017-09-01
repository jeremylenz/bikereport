import React from 'react'
import config from '../config.js'
import { Form, Grid, Dropdown, Header, TextArea, Divider, Button, Link } from 'semantic-ui-react'

const OUR_API_URL = config.OUR_API_URL

class NewReportForm extends React.Component {

  constructor() {
    super ()

    let reportTypes = [
      'Safety issue - General',
      'Police vehicle in bike lane',
      'Other motor vehicle in a bike lane',
      'Police activity',
      'Street defect - Pothole/Pavement issue',
      'Obstruction in a bike lane',
      'Police blockade',
      'Standing water on bike path',
      'Eyes on the Street / Improvement',
      'Just saying hi'
    ]

    let typeOptions = reportTypes.map((rt, idx) => {
      return {
        key: idx,
        value: rt,
        text: rt
      }
    })


    this.state = {
      bikePathsLoaded: false,
      locationsLoaded: false,
      bikePaths: [],
      locations: [],
      bikePathOptions: [],
      locationOptions: [],
      typeOptions: typeOptions

    }
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

  handleSubmit = (event) => {

    let reportType = event.target.parentElement.children[3].children[0].innerText
    let bikePath = event.target.parentElement.children[6].children[0].innerText
    let location = event.target.parentElement.children[9].children[0].innerText
    let details = this.state.details
    let bikePathId = this.state.bikePaths.find((bp) => {return bp.name === bikePath}).id
    let locationId = this.state.locations.find((loc) => {return loc.name === location}).id
    let userId = 1

    this.saveReport(reportType, details, bikePathId, locationId, userId)

  }

  saveReport = (reportType, details, bikePathId, locationId, userId) => {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')

    let myBody =
    {"report": {
                  "report_type": reportType,
                  "details": details,
                  "likes": 0
                  },
      "bike_path": {
                  "id": bikePathId
                },
      "location": {
                  "id": locationId
                },
      "user": {
                  "id": userId
                  }
    }

    fetch(`${OUR_API_URL}/reports`,
      {method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(myBody)
    })
    .then(resp => resp.json())
    .then(resp => console.log(resp))

    }


  handleTextAreaChange = (event) => {
    this.setState({
      details: event.target.value
    })
  }




render () {
  return (
    <div className="put-it-in-a-div">
      <Grid centered columns={2}>
        <Grid.Column>
          <Form>
            <Header as='h2'>New Report</Header>
            <Header as='h3'>What are you reporting?</Header>

            <label htmlFor='type'>Report type:</label>
            <Form.Dropdown placeholder='Report type:' id='type' options={this.state.typeOptions} onChange={this.handleTypeDDChange}/>

            <Header as='h3'>Where did you see it?</Header>
            <label htmlFor='bikepath'>Bike path:</label>
            <Form.Dropdown placeholder='Bike path: ' id='bikepath' options={this.state.bikePathOptions} />
            <label htmlFor='location'>Location:</label>
            <a href='/newlocation' style={{float: 'right'}}>New location</a>
            <Form.Dropdown placeholder='Location: ' id='location' options={this.state.locationOptions} />

            <Header as='h3'>Details</Header>
            <TextArea autoHeight placeholder='Give us the deets' rows={2} value={this.state.details} onChange={this.handleTextAreaChange}/>
            <Divider />
            <Button type='submit' onClick={this.handleSubmit}>Submit</Button>

          </Form>
        </Grid.Column>
      </Grid>



    </div>
  )
}

}

export default NewReportForm
