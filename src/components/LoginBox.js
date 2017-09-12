import React from 'react'
import { Button, Grid, Header, Divider, Icon } from 'semantic-ui-react'
import config from '../config.js'
// import TwitterCallback from './TwitterCallback'
// import config from '../config'
import { Redirect } from 'react-router-dom'

const OUR_API_URL = config.OUR_API_URL
const FACEBOOK_APP_ID = config.FACEBOOK_APP_ID
const OUR_OWN_URL = config.OUR_OWN_URL

class LoginBox extends React.Component {

  constructor () {
    super ()
    this.state = {
      redirect: false,
      loading: false,
      twitterButtonEnabled: false,
      facebookButtonEnabled: true,
      twitterButtonStatus: 'initial state',
      twitterButtonHref: '',
      facebookButtonHref: `https://www.facebook.com/v2.10/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${OUR_OWN_URL}/facebook`
    }
  }

  componentDidMount () {
    this.requestTwitterRequestToken() // twitter

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
    localStorage.setItem('guest', 'true')
    localStorage.setItem('name', 'Guest')
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

  requestTwitterRequestToken = () => {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')
    // myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jwt'))

    let myBody =
    {"oauth": {
                  "oauth_callback": "http://localhost:3000/api/v1/twitter",
                  "http_method": "post",
                  "url": "https://api.twitter.com/oauth/request_token"
                  }
    }

    fetch(`${OUR_API_URL}/oauth`,
      {method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(myBody)
    })
    .then(resp => resp.json())
    .then(resp => this.loadTwitterRequestToken(resp))
  }

  loadTwitterRequestToken = (resp) => {
    console.log(resp)
    let oauth_token = resp.oauth_token
    let oauth_token_secret = resp.oauth_token_secret

    this.setState({
      twitterButtonEnabled: true,
      twitterButtonHref: `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`
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
          as='a'
          href={this.state.facebookButtonHref}
          disabled={!this.state.facebookButtonEnabled}
          fluid
          color='facebook'
          size='huge'
          >
          <Icon name='facebook' /> Facebook
        </Button>

        <Divider />

        <a href={this.state.twitterButtonHref}><Button
          disabled={!this.state.twitterButtonEnabled}
          fluid
          color='twitter'
          size='huge'
          >
          <Icon name='twitter' /> Twitter
        </Button></a>

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
          loading={this.state.loading}
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
