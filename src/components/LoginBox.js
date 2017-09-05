import React from 'react'
import { Button, Grid, Header, Divider, Icon } from 'semantic-ui-react'
// import config from '../config'
import { Redirect } from 'react-router-dom'



class LoginBox extends React.Component {

  constructor () {
    super ()
    this.state = {
      redirect: false
    }
  }

  processGuestLogin = () => {
    this.setState({
      redirect: true
    })
  }

  render () {

    if(this.state.redirect) {
      return (
        <Redirect to={'/main'} />
      )
    }

    return (
      <Grid.Column className='login-box'>
        <Header as='h2'>Welcome to BikeWays</Header>
        <Header as='h4'>Log in with...</Header>
        <Divider />
        <Button
          fluid
          color='facebook'
          size='huge'
          >
          <Icon name='facebook' /> Facebook
        </Button>
        <Divider />
        <Button
          fluid
          color='twitter'
          size='huge'
          >
          <Icon name='twitter' /> Twitter
        </Button>
        <Divider />
        <Button
          fluid
          color='green'
          size='huge'
          basic
          onClick={this.processGuestLogin}
          >
          <Icon name='bicycle' />
          >>  Skip Login
        </Button>
      </Grid.Column>
    )
  }
}

export default LoginBox;
