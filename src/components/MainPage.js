import React from 'react'
// import NewLocationForm from './NewLocationForm'
import ReportsContainer from './ReportsContainer'
import NavBar from './NavBar'
import { Grid } from 'semantic-ui-react'

class MainPage extends React.Component {
  render () {
    return (
      <div className="put-it-in-a-div">
        <NavBar />
        <Grid centered columns={2}>
          <ReportsContainer />

        </Grid>
      </div>
    )
  }

}

export default MainPage
