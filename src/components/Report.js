import React from 'react'
import { Divider, Feed, Button } from 'semantic-ui-react'
import config from '../config.js'

const OUR_API_URL = config.OUR_API_URL

class Report extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      likes: props.reportData.likes,
      hasLiked: false
    }
  }


  incrementLikes = () => {
    if(this.state.hasLiked === false){
      this.setState({
        hasLiked: true,
        likes: this.props.reportData.likes + 1
      },this.postLike)
    }
  }

  postLike = () => {
    let newNumberOfLikes = this.state.likes

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')

    let myBody =
    {"report": {
                  "likes": newNumberOfLikes
                  }
    }

    fetch(`${OUR_API_URL}/reports/${this.props.reportData.id}`,
      {method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(myBody)
    })
    .then(resp => resp.json())
    .then(resp => console.log(resp))
  }

  render () {

    let thisReport = this.props.reportData
    let googleMapImgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.props.location.lat},${this.props.location.long}&zoom=16&size=100x100&scale=2&maptype=terrain&key=${config.GOOGLE_MAPS_API_KEY}`

    return (
      <div className='put-it-in-a-div'>
        <Divider />
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.Date>{thisReport.updated_at}</Feed.Date>
              <Feed.User>{this.props.username}</Feed.User> reported <strong>{thisReport.report_type}</strong>
            </Feed.Summary>
            <Feed.Extra text>On bike path: {this.props.bikePath}</Feed.Extra>
            <Feed.Extra text>Location: {this.props.location.name}</Feed.Extra>
            <Feed.Extra images><a><img src={googleMapImgUrl} height='100' width='100' alt='google map'/></a></Feed.Extra>

            <Feed.Extra text>{thisReport.details}</Feed.Extra>
            <Feed.Meta>
              <Feed.Like>
                <Button
                toggle
                active={this.state.hasLiked}
                content='Say thanks'
                size='small'
                icon='heart'
                color='blue'
                label={{ as: 'p', basic: true, content: this.state.likes }}
                labelPosition='right'
                onClick={this.incrementLikes}
                />


                </Feed.Like>
            </Feed.Meta>
          </Feed.Content>
        </Feed.Event>

      </div>
    )
  }

}


export default Report
