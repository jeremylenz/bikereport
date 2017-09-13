import React from 'react'
import { Header, Icon, Menu, Dropdown } from 'semantic-ui-react'

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
            BikeWays
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

                <Dropdown.Item as='a' href='/'>
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

export default NavBar;
