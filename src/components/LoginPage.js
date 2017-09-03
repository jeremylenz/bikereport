import React from 'react'
import LoginBox from './LoginBox'
import { Grid } from 'semantic-ui-react'

class LoginPage extends React.Component {
  render () {
    return (
      <div className="put-it-in-a-div">
        <Grid centered columns={2}>
          <LoginBox />

        </Grid>
      </div>
    )
  }

}

export default LoginPage
