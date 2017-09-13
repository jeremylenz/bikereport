import React from 'react'
import { Divider, Feed, Button, Image } from 'semantic-ui-react'
import config from '../config.js'
import moment from 'moment'

const OUR_API_URL = config.OUR_API_URL

class Report extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      likes: props.reportData.likes,
      hasLiked: false
    }
  }

  componentDidMount () {
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
    myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('jwt'))


    let myBody =
    {"report": {
                  "likes": newNumberOfLikes
                  }
    }

    fetch(`${OUR_API_URL}/reports/${this.props.reportData.id}`,
      {method: 'PATCH',
      headers: myHeaders,
      body: JSON.stringify(myBody)
    })
    .then(resp => resp.json())
    .then(resp => console.log(resp))
  }

  render () {

    let thisReport = this.props.reportData
    let googleMapImgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.props.location.lat},${this.props.location.long}&zoom=16&size=100x100&scale=2&maptype=terrain&key=${config.GOOGLE_MAPS_API_KEY}`
    let googleMapLinkUrl = `https://www.google.com/maps/?q=loc:${this.props.location.lat},${this.props.location.long}&z=18`
    let relTimeString = moment(thisReport.updated_at).fromNow()
    let absTimeString = moment(thisReport.updated_at).format('LLLL')
    let timeString

    (moment().diff(moment(thisReport.updated_at)) > 100000000) ? timeString = absTimeString : timeString = relTimeString


    return (
      <div className='put-it-in-a-div report'>
        <Divider style={{clear: 'right'}}/>
        <Feed.Event>
          <Feed.Content>
            <Feed.Summary>
              <Feed.Extra images id='report-mini-map'><a target="_blank" href={googleMapLinkUrl}><img src={googleMapImgUrl} height='100' width='100' alt='google map'/></a></Feed.Extra>
              <Feed.Date style={{color: 'gray'}} size='small'>{timeString}</Feed.Date>
              <Feed.User>{this.props.username}</Feed.User> reported <strong>{thisReport.report_type}</strong>
            </Feed.Summary>
            {this.props.bikePath !== "None" &&
            <Feed.Extra text><i>On bike path: </i>{this.props.bikePath}</Feed.Extra>
            }
            <Feed.Extra text><i>Location: </i>{this.props.location.name}</Feed.Extra>

            <Feed.Extra text>{thisReport.details}</Feed.Extra>
            {typeof this.props.image !== 'undefined' &&
            <Feed.Extra images className='report-pic'>
              <Divider />
              <a target='_blank' href={this.props.image.image_url}><Image src={this.props.image.image_url} size='large' alt='report'/></a>
            </Feed.Extra>
            }
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
              {this.props.admin &&
                <Button negative onClick={() => {this.props.deleteReport(thisReport.id)}}>Delete</Button>

              }


                </Feed.Like>
            </Feed.Meta>
          </Feed.Content>
        </Feed.Event>

      </div>
    )
  }

}


export default Report
