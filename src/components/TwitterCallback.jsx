import React from 'react'

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

class TwitterCallback extends React.Component {

  constructor () {
    super ()
    this.state = {
      oauthStatus: 'initial state',  // ['initial state', 'request token requested', 'request token received', 'user redirected to twitter', 'twitter redirected the user here', 'access token requested', 'access token received', 'jwt token requested', 'jwt token received', 'process complete']
      details: []
    }
  }

  componentDidMount () {
    this.setState({
      oauthStatus: 'twitter redirected the user here'
    })
  }

  render () {

  }
}

export default TwitterCallback;
