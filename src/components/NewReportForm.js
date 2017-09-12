import React from 'react'
import config from '../config.js'
import { Form, Grid, Dropdown, Header, TextArea, Divider, Button, Icon } from 'semantic-ui-react'
import ImageUploader from './ImageUploader'

const OUR_API_URL = config.OUR_API_URL

class NewReportForm extends React.Component {

  constructor(props) {
    super (props)

    let reportTypes = [
      'Safety issue - General',
      'Police vehicle in bike lane',
      'Truck/commercial vehicle in bike lane',
      'Other motor vehicle in a bike lane',
      'Police activity',
      'Metal Plates',
      'Street defect - Pothole/Pavement issue',
      'Construction',
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

    let locationId;
    let locationChosen;
    let formStatus;
    let selectedReportType

    if(props.locationId) {
      locationId = props.locationId
      locationChosen = true
      formStatus = 'showing'
    } else {
      locationId = null
      locationChosen = false
      formStatus = 'hidden'
    }

    if(props.reportType) {
      selectedReportType = props.reportType
    } else {
      selectedReportType = 0
    }

    this.state = {
      bikePathsLoaded: false,
      locationsLoaded: false,
      locationChosen: locationChosen,
      details: '',
      bikePaths: [],
      locations: [],
      locationId: locationId,
      bikePathOptions: [],
      locationOptions: [],
      typeOptions: typeOptions,
      selectedBikePathId: 1,
      selectedReportType: selectedReportType,
      saveStatus: 'waiting',
      formStatus: formStatus,
      imageAjax: null

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

    let selectedBikePathId;

    if(this.state.locationId == null) {
      selectedBikePathId = 1
    } else {
      selectedBikePathId = resp.find((loc) => {return loc.id == this.state.locationId}).bike_path_id
    }
    this.setState({
      locationsLoaded: true,
      locationOptions: locationOptions,
      locations: resp,
      selectedBikePathId: selectedBikePathId
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
    let reportType = event.target.parentElement.parentElement.parentElement.children[4].innerText
    let details = this.state.details
    let bikePathId = this.state.selectedBikePathId
    let locationId = this.state.locationId
    let userId = 2

    this.saveReport(reportType, details, bikePathId, locationId, userId)

  }

  setImageToUpload = (header, body) => {
    console.log('setting imageAjax', body)
    this.setState({
      imageAjax: {header: header, body: body}
    })
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
                  "likes": 0,
                  },
      "bike_path": {
                  "id": bikePathId
                },
      "location": {
                  "id": locationId
                },
      "user": {
                  "id": userId
                },

    }
    if(this.state.imageAjax) {
      console.log('adding imageAjax to body')
      myBody["report"]["image"] = this.state.imageAjax.body.image
      myBody["file_data"] = this.state.imageAjax.body.file_data
    }

    console.log(myBody)

    fetch(`${OUR_API_URL}/reports`,
      {method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(myBody)
    })
    .then(resp => resp.json())
    .then((resp) => {
      console.log(resp)
      this.props.loadNewReport(resp.report, resp.image)
      this.setState({
        saveStatus: 'saved',
        imageAjax: null
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
    window.history.pushState({}, "Bikeways", "/main")
    setTimeout(this.cancelForm, 1000)
  }

  cancelForm = () => {
    this.setState({
      formStatus: 'hidden',
      saveStatus: 'waiting',
      details: '',
      locationId: null,
      selectedBikePathId: 0,
      locationChosen: false
    })
  }

  setImageId = (id) => {
    this.setState({
      imageId: id
    })
  }

  handleReportTypeDDChange = (e) => {
    setTimeout(() => {
      let reportTypeText = document.querySelector('#report-type-dropdown div.selected.item').innerText
      let reportIdx = this.state.typeOptions.findIndex((rt) => {return rt.text === reportTypeText})
      this.setState({
      selectedReportType: reportIdx
    })}, 50)


  }




render () {
  let locationName;
  let bikePathName;


  if(this.state.locationId && (this.state.locationsLoaded === true)) {
    locationName = this.state.locations.find((loc) => {return loc.id == this.state.locationId}).name
  } else {
    locationName = "None"
  }

  if(this.state.selectedBikePathId && (this.state.bikePathsLoaded === true)) {
    bikePathName = this.state.bikePaths.find((bikepath) => {return bikepath.id === this.state.selectedBikePathId}).name
  } else {
    bikePathName = "Loading.."
  }

  let reportTypeText = this.state.typeOptions[this.state.selectedReportType].value

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
            <Form.Dropdown placeholder='Report type:' id='report-type-dropdown' options={this.state.typeOptions} value={reportTypeText} onChange={this.handleReportTypeDDChange} />

            <Header as='h3'>Where did you see it?</Header>
            {this.state.locationChosen &&
            <div className='put-it-in-a-div'>
              <Header as='h4'>Location: </Header>
                <a href={`/newlocation/${this.state.selectedReportType}`} style={{float: 'right'}}>Change location</a>
                <p>{locationName}</p>
              <Header as='h4'>Bike Path: </Header>
                <p>{bikePathName}</p>
            </div>
            }

            {this.state.locationChosen === false &&
              <Button as='a' href={`/newlocation/${this.state.selectedReportType}`} basic size='big' color='green'>
                <Icon name='crosshairs' size='big' />Choose Location
              </Button>
            }

            <Header as='h3'>Details</Header>
            <TextArea autoHeight placeholder='Give us the deets' rows={2} value={this.state.details} onChange={this.handleTextAreaChange}/>
            <Divider />
            <Header as='h4'>Upload an image(optional)</Header>
            <ImageUploader setImageToUpload={this.setImageToUpload}/>
            <div className='new-report-form-buttons'>

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
            </div>



          </Form>
        }


        </Grid.Column>

  )
}

}

export default NewReportForm
