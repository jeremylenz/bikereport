import React from 'react'
// import NewLocationForm from './NewLocationForm'
import ReportsContainer from './ReportsContainer'
import NavBar from './NavBar'
import { Grid } from 'semantic-ui-react'

class MainPage extends React.Component {

  componentDidMount () {

  }

  render () {
    console.log('MainPage: locationId = ', this.props.match.params.location_id)
    return (
      <div className="put-it-in-a-div main-page">
        <NavBar />
        <Grid centered columns={2}>
          <Grid.Column textAlign='left' className='reports-container-column dont override my css' >
            <ReportsContainer locationId={this.props.match.params.location_id} reportType={this.props.match.params.report_type}/>
          </Grid.Column>
        </Grid>
      </div>
    )
  }

}

export default MainPage
