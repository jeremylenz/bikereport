import React from 'react'
import config from '../config.js'
import { Redirect } from 'react-router-dom'
import { Dimmer, Loader } from 'semantic-ui-react'


const OUR_API_URL = config.OUR_API_URL
const FACEBOOK_APP_ID = config.FACEBOOK_APP_ID
const OUR_OWN_URL = config.OUR_OWN_URL

class FacebookCallback extends React.Component {

  constructor () {
    super ()
    this.state = {
      done: false

    }
  }

  componentDidMount () {

    console.log(this.props)
    let urlQuery = this.props.location.search
    if(urlQuery.includes("error")) {
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
    } else {
      return ( <Dimmer active inverted>
        <Loader size='large'>Logging in with Facebook...</Loader>
      </Dimmer>)
    }

  }
}

export default FacebookCallback;
