import React, { Component } from 'react';
import Map from './MapContainer'

class LandingPage extends Component {
  constructor(props: any) {
    super(props)
  }
  componentWillMount() {

  }
  render() {
    return (
      <div className="landing-page">
        <h2>Project Map</h2>
        <Map />
      </div>
    )
  }

}

export default LandingPage
