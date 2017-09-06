import React from 'react'
import { Button, Grid, Header, Divider, Icon } from 'semantic-ui-react'
import config from '../config.js'
// import config from '../config'
import { Redirect } from 'react-router-dom'

const OUR_API_URL = config.OUR_API_URL

class LoginBox extends React.Component {

  constructor () {
    super ()
    this.state = {
      redirect: false,
      loading: false,
      twitterButtonEnabled: false,
      facebookButtonEnabled: false
    }
  }

  processGuestLogin = () => {
    this.getGuestJWT()
    .then(
    this.setState({
      loading: false,
      redirect: true
    }, () => console.log('got guest JWT!'))
    )
  }

  getGuestJWT = () => {
    this.setState({
      loading: true
    })

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')

    let myBody =
    {"user":
            {"email":"jerbear@jerbear.com"}
    }

    return fetch(`${OUR_API_URL}/login`,
      {method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(myBody)
      })
    .then(resp => resp.json())
    .then(resp => this.setGuestJWT(resp))


  }

  setGuestJWT (resp) {
    localStorage.setItem('jwt', resp.jwt)
    localStorage.setItem('guest', true)
    console.log('set JWT!')
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
        {this.state.facebookButtonEnabled &&
        <Button
          fluid
          color='facebook'
          size='huge'
          >
          <Icon name='facebook' /> Facebook
        </Button>
        }
        {!this.state.facebookButtonEnabled &&
        <Button
          disabled
          fluid
          color='facebook'
          size='huge'
          >
          <Icon name='facebook' /> Facebook
        </Button>
        }
        <Divider />
        {this.state.twitterButtonEnabled &&
        <Button
          fluid
          color='twitter'
          size='huge'
          >
          <Icon name='twitter' /> Twitter
        </Button>
        }
        {!this.state.twitterButtonEnabled &&
        <Button
          disabled
          fluid
          color='twitter'
          size='huge'
          >
          <Icon name='twitter' /> Twitter
        </Button>
        }

        <Divider />
        {this.state.loading === false &&
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
        }
        {this.state.loading &&
        <Button
          fluid
          loading
          color='green'
          size='huge'
          basic
          onClick={this.processGuestLogin}
          >Okay!  One sec..</Button>
        }
      </Grid.Column>
    )
  }
}

export default LoginBox;
