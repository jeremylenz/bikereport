import React from 'react'
import { Redirect } from 'react-router-dom'
import { Dimmer, Loader, Button, Message } from 'semantic-ui-react'
import runtimeEnv from '@mars/heroku-js-runtime-env';

const env = runtimeEnv();
const OUR_API_URL = env.REACT_APP_OUR_API_URL
const FACEBOOK_APP_ID = env.REACT_APP_FACEBOOK_APP_ID
const OUR_OWN_URL = env.REACT_APP_OUR_OWN_URL

class FacebookCallback extends React.Component {

  constructor () {
    super ()
    this.state = {
      done: false,
      error: false,
      error_list: []

    }
  }

  componentDidMount () {

    console.log(this.props)
    let urlQuery = this.props.location.search
    if(urlQuery.includes("error")) {
      this.setState({error: true})
      console.log('error logging in, ', urlQuery.split('?'))
    } else {
    let facebookCode = this.props.location.search.split('?code=')[1]
    console.log(facebookCode)
    this.getAccessToken(facebookCode)
    }
    // this.getAccessToken(this.props.match.params.token, this.props.match.params.verifier)
  }

  getAccessToken = (code) => {

      this.setState({
        loading: true
      })

      let myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append('Accept', 'application/json')
      // myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jwt'))

      let myBody =
      {"facebook": {
                    "client_id": FACEBOOK_APP_ID,
                    "redirect_uri": `${OUR_OWN_URL}/facebook`, // app secret also needed
                    "code": `${code}`
                    }
      }

      fetch(`${OUR_API_URL}/facebook_oauth`,
        {method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(myBody)
      })
      .then(resp => resp.json())
      .then(resp => this.setFacebookJwt(resp))

  }


  setFacebookJwt (resp) {
    console.log(resp)
    localStorage.setItem('jwt', resp.jwt)
    localStorage.setItem('guest', false)
    localStorage.setItem('name', resp.username)
    console.log('set Facebook JWT!')
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

          <Message error header='Error logging in with Facebook'
            list={['You may have declined permissions', `Sorry ¯\_(ツ)_/¯"`]} />
          <Button as='a' href='/'>Back to login</Button>

        </div>
      )

    } else {
      return ( <Dimmer active inverted>
        <Loader size='large'>Logging in with Facebook...</Loader>
      </Dimmer>)
    }

  }
}

export default FacebookCallback;
