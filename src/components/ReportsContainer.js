import React from 'react'
import config from '../config'
import Report from './Report'
import NewReportForm from './NewReportForm'
import { Feed, Button } from 'semantic-ui-react'

const OUR_API_URL = config.OUR_API_URL

class ReportsContainer extends React.Component {

  constructor () {
    super ()
    this.state = {
      reports: [],
      reportsLoaded: false,
      allReportsLoaded: true,
      bikePaths: [],
      users: [],
      locations: []
    }
  }

  componentDidMount() {

    let stuffToFetch = ['reports','bike_paths','users','locations']

    let myPromises = stuffToFetch.map((thing) => {
      return fetch(`${OUR_API_URL}/${thing}`)
      .then(resp => resp.json())
    })

    Promise.all(myPromises)
    .then((resp) => this.setState({
      reports: resp[0],
      bikePaths: resp[1],
      users: resp[2],
      locations: resp[3]
    }))

  }

  loadReports = (resp) => {
    this.setState({
      reports: resp,
      reportsLoaded: true
    })
  }

  loadNewReport = (resp) => {
    this.setState({
      reports: [resp, ...this.state.reports]
    })
  }

  render () {




    return (
      <div className='put-it-in-a-div'>
        <NewReportForm loadNewReport={this.loadNewReport} />
        <Feed size='large'>
          {this.state.reports.map((report) => {
            let bikePath = this.state.bikePaths.find((bp) => {return bp.id === report.bike_path_id }).name
            let username = this.state.users.find((user) => {return user.id === report.user_id}).username
            let location = this.state.locations.find((loc) => {return loc.id === report.location_id})
            return <Report
              reportData={report}
              key={report.id}
              bikePath={bikePath}
              username={username}
              location={location}/>
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
