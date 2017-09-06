import React from 'react'
import config from '../config.js'
import { Form, Grid, Dropdown, Header, TextArea, Divider, Button, Icon } from 'semantic-ui-react'

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
      details: '',
      bikePaths: [],
      locations: [],
      bikePathOptions: [],
      locationOptions: [],
      typeOptions: typeOptions,
      selectedBikePathId: 1,
      saveStatus: 'waiting',
      formStatus: 'hidden'

    }
  }



  componentDidMount() {

    let promise1 = fetch(`${config.OUR_API_URL}/bike_paths`)
    .then(resp => resp.json());
    let promise2 = fetch(`${config.OUR_API_URL}/locations`)
    .then((resp) => resp.json());

    let fetches = [promise1, promise2]

    Promise.all(fetches)
    .then((resp) => {this.loadBikePaths(resp[0])
                    this.loadLocations(resp[1])})


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

  findBikePathId(bikePathName) {
    return this.state.bikePaths.find((bikePath) => {
      return bikePath.name === bikePathName
    }).id
  }

  findOrCreate = (bikePathName) => {
    let result = this.state.bikePaths.find((bikePath) => {
      return bikePath.name === bikePathName
    })
    if(typeof result === 'undefined') {
      this.createNewBikePath(bikePathName)
    } else {
      console.log(result)
      return result
    }
  }

  createNewBikePath = (bikePathName) => {
    console.log('creating new bikePath...')
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')

    let myBody =
    {"bike_path": {
                  "name": bikePathName
                  }
    }

    fetch(`${OUR_API_URL}/bike_paths`,
      {method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(myBody)
    })
    .then(resp => resp.json())
    .then((resp) => {console.log(resp);
      this.setState({bikePaths: [resp, ...this.state.bikePaths],
      selectedBikePathId: resp.id})
    })
  }

  handleSubmit = (event) => {
    let reportType = event.target.parentElement.parentElement.children[4].children[0].innerText
    let bikePath = event.target.parentElement.parentElement.children[6].children[1].innerText
    let location = event.target.parentElement.parentElement.children[7].children[2].innerText
    let details = this.state.details
    let bikePathId = this.state.bikePaths.find((bp) => {return bp.name === bikePath}).id
    let locationId = this.state.locations.find((loc) => {return loc.name === location}).id
    let userId = 1

    this.saveReport(reportType, details, bikePathId, locationId, userId)

  }

  saveReport = (reportType, details, bikePathId, locationId, userId) => {
    this.setState({
      saveStatus: 'saving'
    })
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')
    myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jwt'))

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
    .then((resp) => {
      console.log(resp)
      this.props.loadNewReport(resp)
      this.setState({
        saveStatus: 'saved'
      }, this.resetForm)
    })

    }

  handleBikePathDDChange = (event) => {
    // This function filters the locations dropdown to only those on the selected bike path
    let bikePath = event.target.innerText
    if(bikePath === "Bike path: "){
      bikePath = "None"
    }
    let bikePathId;
    // if you click outside the dropdown, text will be all of the options, and will thus have a newline character.   In this case, we want to leave the selected bike path unchanged.
    if(/\n/.test(bikePath)){
      bikePathId = this.state.selectedBikePathId
    } else {
      bikePathId = this.findBikePathId(bikePath)
    }
    let newLocations = this.state.locations.filter((location) => {
      return location.bike_path_id === bikePathId
    })

    let locationOptions = newLocations.map((location) => {
      return {key: location.id,
              value: location.name,
              text: location.name}
    })

    this.setState({
      locationsLoaded: true,
      locationOptions: locationOptions,
      selectedBikePathId: bikePathId
    })


  }


  handleTextAreaChange = (event) => {
    this.setState({
      details: event.target.value
    })
  }

  showForm = () => {
    this.setState({
      formStatus: 'showing'
    })
  }

  resetForm = () => {
    // Allow the user, for 1000 milliseconds, to bask in the joy of having successfully saved
    setTimeout(this.cancelForm, 1000)
  }

  cancelForm = () => {
    this.setState({
      formStatus: 'hidden',
      saveStatus: 'waiting',
      details: ''
    })
  }




render () {
  return (

        <Grid.Column>
          {this.state.formStatus === 'hidden' &&
          <div>
            <Divider />
            <Button basic fluid size='huge' color='green' onClick={this.showForm}>
              <Icon name='bicycle' size='big' />Submit a Report
            </Button>
          </div>
          }
          {this.state.formStatus === 'showing' &&
          <Form>
            <Divider />
            <Header as='h2'>New Report</Header>
            <Header as='h3'>What are you reporting?</Header>

            <label htmlFor='type'>Report type:</label>
            <Form.Dropdown placeholder='Report type:' id='type' options={this.state.typeOptions} />

            <Header as='h3'>Where did you see it?</Header>
            <Form.Field inline>
              <label htmlFor='bikepath'>Bike path:</label>
              <Dropdown placeholder='Bike path: ' id='bikepath' options={this.state.bikePathOptions} onChange={this.handleBikePathDDChange} />
            </Form.Field>
            <Form.Field inline>
              <label htmlFor='location'>Location:</label>
              <a href='/newlocation' style={{float: 'right'}}>New location</a>
              <Dropdown placeholder='Location: ' id='location' options={this.state.locationOptions} />
            </Form.Field>

            <Header as='h3'>Details</Header>
            <TextArea autoHeight placeholder='Give us the deets' rows={2} value={this.state.details} onChange={this.handleTextAreaChange}/>
            <Divider />
            {this.state.saveStatus === 'waiting' &&
            <Button.Group>
            <Button type='submit' basic color='green' onClick={this.handleSubmit}>Submit</Button>
            <Button onClick={this.cancelForm} basic color='red'>Cancel</Button>
            </Button.Group>

            }
            {this.state.saveStatus === 'saving' &&
              <Button.Group>
              <Button type='submit' basic color='green' disabled >Saving...</Button>
              <Button disabled basic color='red'>...</Button>
              </Button.Group>
            }
            {this.state.saveStatus === 'saved' &&
              <Button.Group>
              <Button type='submit' basic color='green' disabled >Saved!</Button>
              <Button disabled basic color='green'>
                <Icon name='checkmark' color='green' />
              </Button>
              </Button.Group>

            }



          </Form>
        }


        </Grid.Column>

  )
}

}

export default NewReportForm
