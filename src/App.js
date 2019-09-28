import React, { Component } from 'react'
import Navbar from './components/layout/Navbar'
import Search from './components/Search'

 class App extends Component {

  render(){
    return(
      <React.Fragment>
        <Navbar/>
          <Search/>
        </React.Fragment>

      )
  }
}

export default App