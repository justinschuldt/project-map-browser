import React, { Component } from 'react';
import './App.less';

import { Button } from 'antd';
import LandingPage from './components/LandingPage'

const geoFindMe = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position: { coords: { latitude: number, longitude: number } }) => {
      console.log('position.coords: ', position.coords)
      resolve(position.coords)
    }, err => {
      reject(err)
    });
  })
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="logo">

          </div>
          <LandingPage />
          <Button type="primary" onClick={geoFindMe}>get location</Button>
        </header>
      </div>
    );
  }
}

export default App;
