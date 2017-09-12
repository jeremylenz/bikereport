import React from 'react'
import config from '../config.js'
import { Redirect } from 'react-router-dom'
import { Dimmer, Loader, Message, Button } from 'semantic-ui-react'

// 1. User clicks login with Twitter
// - Assemble Oauth headers
// 2. Send POST request to oauth / request_token specifying oauth_callback that Twitter will redirect to
// 3. Verify that response has 200 status code and oauth_callback_confirmed is true.  This response is our request token.  Save it.
// - Assemble Oauth headers ?
// 4. Redirect user via HTTP 302 redirect to GET oauth / authenticate (new window), passing the request token as oauth_token parameter
// - Twitter displays auth screen(s) to user if needed
// 5. Twitter redirects user to this page here
// 6. Get oauth_token and oauth_verifier from url params
// - Assemble Oauth headers
// 7. Send POST request to Twitter to upgrade request token to an access token
// 8. Receive access token; save token, secret, user info
// 9. We call our back-end API and give them the user's email to find or create the user
// 10. Back-end API encodes all this info into a JWT token and sends it back to us
// 11. We save the JWT token to local storage
// 12. User is now logged in and can create new reports/locations

const OUR_API_URL = config.OUR_API_URL

class TwitterCallback extends React.Component {

  constructor () {
    super ()
    this.state = {
      done: false,
      error: false
       // ['initial state', 'request  requested', 'request token received', 'user redirected to twitter', 'twitter redirected the user here', 'access token requested', 'access token received', 'jwt token requested', 'jwt token received', 'process complete']
    }
  }

  componentDidMount () {
    this.setState({
      oauthStatus: 'i dunno'
    })
    console.log(this.props)
    this.getAccessToken(this.props.match.params.token, this.props.match.params.verifier)
  }

  getAccessToken = (token, verifier) => {

      this.setState({
        loading: true
      })

      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append('Accept', 'application/json')
      // myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jwt'))

      let myBody =
      {"oauth": {
                    "http_method": "post",
                    "url": "https://api.twitter.com/oauth/access_token",
                    "oauth_token": `${token}`,
		                "oauth_verifier": `${verifier}`
                    }
      }

      fetch(`${OUR_API_URL}/oauth`,
        {method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(myBody)
      })
      .then(resp => resp.json())
      .then(resp => this.issueTwitterJwt(resp))
      .catch(this.handleError)

  }

  issueTwitterJwt = (resp) => {

    let screenName = resp.screen_name
    // let userId = resp.user_id
    let oauthToken = resp.oauth_token
    let oauthTokenSecret = resp.oauth_token_secret
      this.setState({
        loading: true
      })

      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append('Accept', 'application/json')

      let myBody =
      {"user":
              {"screen_name": screenName,
              "oauth_token": oauthToken,
              "oauth_token_secret": oauthTokenSecret}
      }
      console.log('getting Twitter JWT')

      return fetch(`${OUR_API_URL}/login`,
        {method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(myBody)
        })
      .then(resp => resp.json())
      .then(resp => this.setTwitterJWT(resp, screenName))




  }

  setTwitterJWT (resp, screenName) {
    localStorage.setItem('jwt', resp.jwt)
    localStorage.setItem('guest', false)
    localStorage.setItem('name', screenName)
    console.log('set JWT!')
    this.setState({
      done: true
    })
  }


  render () {

    if(this.state.done) {
      return (<Redirect to={'/main'} />)
    } else if (this.state.error) {
      return (
        <div className='put-it-in-a-div' >

          <Message error header='Error logging in with Twitter'

            list={[`Sorry ¯\\_(ツ)_/¯\"`]} />
          <Button as='a' href='/'>Back to login</Button>

        </div>
      )

    } else {
      return ( <Dimmer active inverted>
        <Loader size='large'>Logging in with Twitter...</Loader>
      </Dimmer>)
    }

  }
}

export default TwitterCallback;
