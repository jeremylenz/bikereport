import React from 'react'
import Report from './Report'
import NewReportForm from './NewReportForm'
import { Feed, Button, Message } from 'semantic-ui-react'
import runtimeEnv from '@mars/heroku-js-runtime-env';

const env = runtimeEnv();
const OUR_API_URL = env.REACT_APP_OUR_API_URL

class ReportsContainer extends React.Component {

  constructor () {
    super ()
    this.state = {
      reports: [],
      reportsLoaded: false,
      allReportsLoaded: true,
      bikePaths: [],
      users: [],
      locations: [],
      images: [],
      loggedIn: localStorage.getItem('guest') === "false",
      admin: false,
      error: false,
      errorReason: ''
    }
  }

  componentDidMount() {

    let stuffToFetch = ['reports','bike_paths','users','locations', 'images']

    let myPromises = stuffToFetch.map((thing) => {
      return fetch(`${OUR_API_URL}/${thing}`)
      .then(resp => resp.json())
    })

    Promise.all(myPromises)
    .then((resp) => this.setState({
      reports: resp[0],
      bikePaths: resp[1],
      users: resp[2],
      locations: resp[3],
      images: resp[4],
      reportsLoaded: true
    }))
    .catch(this.handleError)

  }

  handleError = (reason) => {
    this.setState({
      error: true,
      errorReason: reason.stack
    })
  }

  loadReports = (resp) => {
    this.setState({
      reports: resp,
      reportsLoaded: true
    })
  }

  loadNewReport = (report, image) => {
    let newImages;
    if(image == null) {
      newImages = this.state.images
    } else {
      newImages = [image, ...this.state.images]
    }
    this.setState({
      reports: [report, ...this.state.reports],
      images: newImages
    })
  }

  deleteReport = (id) => {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')
    myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jwt'))


    let myBody = {}

    fetch(`${OUR_API_URL}/reports/${id}`,
      {method: 'DELETE',
      headers: myHeaders,
      body: JSON.stringify(myBody)
    })
    .then(resp => resp.json())
    .then(resp => console.log(resp))
    .then(this.setState({
      reports: this.state.reports.filter((rep) => {return rep.id !== id})
    }))
    .catch(this.handleError)
  }

  render () {

    if(this.state.error) {
      return (
        <Message error header='Error loading reports'
          list={[this.state.errorReason, `Sorry ¯\\_(ツ)_/¯\"`]} />
      )
    }




    return (
      <div className='put-it-in-a-div reports-container'>
          {this.state.loggedIn &&
          <NewReportForm loadNewReport={this.loadNewReport} locationId={this.props.locationId} reportType={this.props.reportType} />
          }

          <Feed size='large'>
            {this.state.reports.map((report) => {
              let bikePath = this.state.bikePaths.find((bp) => {return bp.id === report.bike_path_id }).name
              let username = this.state.users.find((user) => {return user.id === report.user_id}).username
              let location = this.state.locations.find((loc) => {return loc.id === report.location_id})
              let image = this.state.images.find((img) => {return img.report_id === report.id})
              return <Report
                reportData={report}
                key={report.id}
                bikePath={bikePath}
                username={username}
                location={location}
                image={image}
                admin={this.state.admin}
                deleteReport={this.deleteReport}
                />
            })}
        </Feed>
        {this.state.allReportsLoaded === false &&
        <Button fluid size='big' primary>Load More</Button>

        }

      </div>
    )
  }

}


export default ReportsContainer
