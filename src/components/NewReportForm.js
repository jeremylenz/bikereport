import React from 'react'
import { Form, Grid, Header, TextArea, Divider, Button, Icon, Message } from 'semantic-ui-react'
import ImageUploader from './ImageUploader'
import runtimeEnv from '@mars/heroku-js-runtime-env';
import { addReport, loadBikePaths, loadLocations, saveReport } from '../actions/actions.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


const env = runtimeEnv();
const OUR_API_URL = env.REACT_APP_OUR_API_URL
const GOOGLE_MAPS_API_KEY = env.REACT_APP_GOOGLE_MAPS_API_KEY

class NewReportForm extends React.Component {

  constructor(props) {
    super (props)

    let reportTypes = [
      'Safety Issue - General',
      'Police Vehicle in Bike Lane',
      'Truck/Commercial Vehicle in Bike Lane',
      'Other Motor Vehicle in Bike Lane',
      'Police Activity',
      'Metal Plates',
      'Street Defect - Pothole/Pavement issue',
      'Construction',
      'Obstruction in a Bike Lane',
      'Police Blockade',
      'Standing Water on Bike Path',
      'Eyes on the Street / Improvement',
      'Just Saying Hi'
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
    let selectedReportType;

    // if(props.locationId) {
    //   locationId = props.locationId
    //   locationChosen = true
    //   formStatus = 'showing'
    // } else {
    //   locationId = null
    //   locationChosen = false
    //   formStatus = 'hidden'
    // }

    if(props.newReportData && props.newReportData.locationId) {
      locationId = props.newReportData.locationId
      console.log(locationId)
      locationChosen = true
      formStatus = 'showing'
    } else {
      locationId = null
      locationChosen = false
      formStatus = 'hidden'
    }

    let selectedReportTypeId;
    if(props.reportType) {

      selectedReportTypeId = parseInt(props.reportType)
      selectedReportType = typeOptions.find((type) => {return type.key === selectedReportTypeId}).value
    } else {
      selectedReportType = 'Safety Issue - General'
      selectedReportTypeId = 0
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
      selectedReportTypeId: selectedReportTypeId,
      saveStatus: 'waiting',
      formStatus: formStatus,
      imageAjax: null,
      error: false,
      errorReason: '',
      validationsPassed: false

    }
  }



  componentDidMount() {

    this.validateFormFields()

    let promise1 = fetch(`${OUR_API_URL}/bike_paths`)
    .then(resp => resp.json());
    let promise2 = fetch(`${OUR_API_URL}/locations`)
    .then((resp) => resp.json());

    let fetches = [promise1, promise2]

    Promise.all(fetches)
    .then((resp) => {this.loadBikePaths(resp[0])
                    this.loadLocations(resp[1])})
                    .catch(this.handleError)


  }

  handleError = (reason) => {
    this.setState({
      error: true,
      errorReason: reason.stack
    })
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





  handleSubmit = (event) => {
    let reportType = this.state.selectedReportType
    let details = this.state.details
    let bikePathId = this.state.selectedBikePathId
    let locationId = this.state.locationId
    let username = localStorage.getItem('name')



    this.saveReport(reportType, details, bikePathId, locationId, username)

  }

  setImageToUpload = (header, body) => {
    this.setState({
      imageAjax: {header: header, body: body}
    })
  }

  validateFormFields = () => {
    if(this.state.locationChosen) {
      this.setState({
        validationsPassed: true
      })
    }
  }

  saveReport = (reportType, details, bikePathId, locationId, username) => {
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
                  "username": username
                },

    }
    if(this.state.imageAjax) {
      myBody["report"]["image"] = this.state.imageAjax.body.image
      myBody["file_data"] = this.state.imageAjax.body.file_data
    }

    this.props.saveReport(myBody)
    this.setState({
      saveStatus: 'saved',
      imageAjax: null
    }, this.resetForm)


    // fetch(`${OUR_API_URL}/reports`,
    //   {method: 'POST',
    //   headers: myHeaders,
    //   body: JSON.stringify(myBody)
    // })
    // .then(resp => resp.json())
    // .then((resp) => {
    //   this.props.loadNewReport(resp.report, resp.image)
      // this.setState({
      //   saveStatus: 'saved',
      //   imageAjax: null
      // }, this.resetForm)
    // })

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
    window.history.pushState({}, "Bikeways", "/main")
    window.scrollTo(0,0);
    this.setState({
      formStatus: 'hidden',
      saveStatus: 'waiting',
      details: '',
      locationId: null,
      selectedBikePathId: 0,
      locationChosen: false,
      validationsPassed: false
    })
  }

  setImageId = (id) => {
    this.setState({
      imageId: id
    })
  }

  handleReportTypeDDChange = (e, data) => {
      this.setState({
      selectedReportType: data.value,
      selectedReportTypeId: this.state.typeOptions.find((type) => {return type.value === data.value}).key
    })


  }




render () {

  if(this.state.error) {
    return (
      <Message error header='Error saving report'
        list={[this.state.errorReason, `Sorry ¯\\_(ツ)_/¯\"`]} />
    )
  }

  let googleMapImgUrl;
  let googleMapLinkUrl;
  if (this.state.locationChosen && this.state.locationsLoaded) {
    let location = this.state.locations.find((loc) => {return loc.id == this.state.locationId})
    let locLat = location.lat
    let locLong = location.long
    googleMapImgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${locLat},${locLong}&zoom=16&size=100x100&scale=2&maptype=terrain&key=${GOOGLE_MAPS_API_KEY}`
    googleMapLinkUrl = `https://www.google.com/maps/?q=loc:${locLat},${locLong}&z=18`
  } else {
    googleMapImgUrl = ""
    googleMapLinkUrl = ""
  }

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

            <Form.Dropdown placeholder='Report type:' pointing id='report-type-dropdown' options={this.state.typeOptions} value={this.state.selectedReportType} onChange={this.handleReportTypeDDChange} />

            <Header as='h3'>Where did you see it?</Header>

            {this.state.locationChosen &&
            <div className='put-it-in-a-div'>
                <a target="_blank" id='report-mini-map' href={googleMapLinkUrl}><img src={googleMapImgUrl} height='100' width='100' alt='google map'/></a>
                <a href={`/newlocation/${this.state.selectedReportTypeId}`} style={{float: 'right', clear: 'right'}}>Change Location</a>
                <Header as='h4'>Location: </Header>
                <p>{locationName}</p>
              <Header as='h4'>Bike Path: </Header>
                <p>{bikePathName}</p>
            </div>
            }

            {this.state.locationChosen === false &&
              <Button as='a' href={`/newlocation/${this.state.selectedReportTypeId}`} basic size='big' color='green'>
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
              <Button type='submit' basic color='green' onClick={this.handleSubmit} disabled={!this.state.validationsPassed}>Submit</Button>
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

const mapStateToProps = (reduxState) => {
  return {
    currentUser: reduxState.currentUser,
    // reports: reduxState.reports,
    bikePaths: reduxState.bikePaths,
    locations: reduxState.locations,
    newReportData: reduxState.newReportData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addReport: addReport,
    loadBikePaths: loadBikePaths,
    loadLocations: loadLocations,
    saveReport: saveReport,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewReportForm)
