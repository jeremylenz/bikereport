import React from 'react'
import { Header, Icon, Menu, Dropdown } from 'semantic-ui-react'

class NavBar extends React.Component {
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
            <Dropdown item text='Hello, Guest'>
              <Dropdown.Menu>
                <Dropdown.Item as='a' href='/'>Log In</Dropdown.Item>
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
