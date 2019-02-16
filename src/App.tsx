import React, { Component } from 'react';
import './App.less';

import { Button } from 'antd';

import Portis from '@portis/web3';
import Web3 from 'web3';
import * as assist from 'bnc-assist'

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
  constructor(props: any) {
    super(props)
    this.portisClicked = this.portisClicked.bind(this)
    this.blocknativeClicked = this.blocknativeClicked.bind(this)
  }
  portisClicked() {
    const portis = new Portis('b3f16d56-4b6c-434b-9c90-9ce46d496013', 'rinkeby' // ,
      // { scope: ['email'] }
    );
    const web3 = new Web3(portis.provider);
    if (web3) {
      web3.eth.getAccounts((error, accounts) => {
        console.log(accounts);
      });
    }
  }
  async blocknativeClicked() {
    const bnKey = 'd7603484-6a29-4dab-898b-f6a57f36e83d'
    const main = 1
    const ropsten = 3
    const rinkeby = 4
    var assistInstance = assist.init({ dappId: bnKey, networkId: rinkeby });

    try {
      // onboard visitors
      const result = await assistInstance.onboard()
      console.log('result: ', result)
    } catch (error) {
      // user exited onboarding before completion
      console.log(error.msg);
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="logo">

          </div>
          <LandingPage />
          <Button type="primary" onClick={geoFindMe}>get location</Button>
          <Button type="primary" onClick={this.portisClicked}>Login with Portis</Button>
          <Button type="primary" onClick={this.blocknativeClicked}>Login with Blocknative</Button>
        </header>
      </div>
    );
  }
}

export default App;
