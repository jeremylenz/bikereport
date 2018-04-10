import React from 'react'
import { Header, Icon, Menu, Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { recordGuestLogin } from '../actions/actions.js'

class NavBar extends React.Component {

  constructor () {
    super ()
    this.state = {
      name: 'Guest'
    }
  }

  componentDidMount() {
    let name = localStorage.getItem('name')
    let guest = localStorage.getItem('guest')
    if((guest === 'false') && (name !== 'Guest')) {
      this.setState({
        name: name
      })
    }
  }

  render () {
    return (
      <div className='Xnavbar-container' >

      <div className='navbar'>
        <div className='header-container'>

          <Header as='h1' className='nav-header' style={{color: 'white'}}>
            <Icon name='bicycle' />
            BikeWaze
          </Header>
        </div>

        <div className='header-menu-container'>
          <Menu size='large' color='blue' inverted compact>
            <Dropdown item icon='list layout'>
              <Dropdown.Menu>
                {this.state.name === 'Guest' &&
                <Dropdown.Item as='a' href='/'>Log In</Dropdown.Item>
                }
                {this.state.name !== 'Guest' &&

                <Dropdown.Item as='a' href='/' onClick={this.props.recordGuestLogin}>
                  <Header as='h4'>{this.state.name}</Header>
                  <p>Log Out</p>
                </Dropdown.Item>
                }
              </Dropdown.Menu>
            </Dropdown>


          </Menu>
        </div>

      </div>

    </div>
    )

  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    recordGuestLogin: recordGuestLogin,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
