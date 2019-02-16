import React, { Component } from 'react';
import './App.less';

import { Button } from 'antd';

import Portis from '@portis/web3';
import Web3 from 'web3';
import * as assist from 'bnc-assist';

import StandardBountiesAbi from '../src/definitions/contractAbi/StandardBounties.json';
import HumanStandardTokenAbi from '../src/definitions/contractAbi/HumanStandardToken.json';

import LandingPage from './components/LandingPage';
import {
  Bounty,
  BountyMetadata,
  User,
  UserMetadata
} from './definitions/entities/entities';

const geoFindMe = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position: { coords: { latitude: number; longitude: number } }) => {
        console.log('position.coords: ', position.coords);
        resolve(position.coords);
      },
      err => {
        reject(err);
      }
    );
  });
};

class App extends Component {
  portis?: Portis;
  web3?: Web3;

  tokenInstance?: any;
  standardBountiesInstance?: any;
  bountyRoyaltiesInstance?: any;
  contractsConnected?: any;

  constructor(props: any) {
    super(props);
    this.portisClicked = this.portisClicked.bind(this);
    this.blocknativeClicked = this.blocknativeClicked.bind(this);

    // Default INFURA provider for read access
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://rinkeby.infura.io/${process.env.REACT_APP_INFURA_API_KEY}`
      )
    );

    console.log('web3 infura connected', this.web3);

    this.initContractInstances();
  }
  portisClicked() {
    const portis = new Portis(
      'b3f16d56-4b6c-434b-9c90-9ce46d496013',
      'rinkeby' // ,
      // { scope: ['email'] }
    );

    this.portis = portis;
    console.log(this.portis);

    const web3 = new Web3(portis.provider);
    if (web3) {
      this.web3 = web3;
      console.log('web3 available');
      web3.eth.getAccounts((error, accounts) => {
        console.log(accounts);
      });

      this.initContractInstances();
    }
  }
  async blocknativeClicked() {
    const bnKey = 'd7603484-6a29-4dab-898b-f6a57f36e83d';
    const main = 1;
    const ropsten = 3;
    const rinkeby = 4;
    var assistInstance = assist.init({ dappId: bnKey, networkId: rinkeby });

    try {
      // onboard visitors
      const result = await assistInstance.onboard();
      console.log('result: ', result);
    } catch (error) {
      // user exited onboarding before completion
      console.log(error.msg);
    }
  }

  async initContractInstances() {
    if (!this.web3) {
      return;
    }
    this.standardBountiesInstance = new this.web3.eth.Contract(
      StandardBountiesAbi as any,
      process.env.REACT_APP_STANDARD_BOUNTIES_ADDRESS
    );

    console.log('contract instances init');

    this.contractsConnected = true;

    await this.getBounties();
  }

  async initEventListeners() {}

  // Mass of blockchain actions
  async getBounties() {
    let bounties: Array<Bounty> = [];

    const numBounties = await this.standardBountiesInstance.methods
      .getNumBounties()
      .call();
    console.log('numBounties', numBounties);
    for (let i = 0; i < numBounties; i++) {
      const bounty = await this.getBounty(i);
      bounties.push(bounty);
      console.log(bounty);
    }

    return bounties;
  }

  async getBounty(bountyId: number): Promise<Bounty> {
    if (!this.web3) {
      throw new Error('no Web3');
    }

    let bounty: Bounty = {} as Bounty;

    const bountyData = await this.standardBountiesInstance.methods
      .getBounty(bountyId)
      .call();
    console.log(bountyData);

    bounty.issuer = bountyData[0];
    bounty.deadline = bountyData[1];
    bounty.fulfillmentAmount = bountyData[2];
    bounty.paysTokens = bountyData[3];
    bounty.bountyStage = bountyData[4];
    bounty.balance = bountyData[5];

    const bountyDataKey = await this.standardBountiesInstance.methods
      .getBountyData(bountyId)
      .call();

    bounty.metadata = await this.getBountyMetadata(bountyDataKey);

    bounty.arbiter = process.env.REACT_APP_GIS_CORPS_ADDRESS as any;

    console.log('bounty found', bounty);
    return bounty;
  }

  async getUser(address: string): Promise<User> {
    let user: User = {} as User;

    const userStats = await this.standardBountiesInstance.methods
      .getUserStats(address)
      .call();
    user.address = address;
    user.bountiesWon = userStats[0];
    user.royaltiesWon = userStats[1];
    user.metadata = await this.getUserMetadata(address);
    return user;
  }

  // Database Functions

  async getBountyMetadata(key: string): Promise<BountyMetadata> {
    let metadata: BountyMetadata = {
      title: 'Bounty Title',
      description: 'Bounty Description'
    };
    return metadata;
  }
  async getUserMetadata(key: string): Promise<UserMetadata> {
    let metadata: UserMetadata = {
      name: 'Test User',
      bio: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
      imgUrl: ''
    };
    return metadata;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="logo" />
          <LandingPage />
          <Button type="primary" onClick={geoFindMe}>
            get location
          </Button>
          <Button type="primary" onClick={this.portisClicked}>
            Login with Portis
          </Button>
          <Button type="primary" onClick={this.blocknativeClicked}>
            Login with Blocknative
          </Button>
        </header>
      </div>
    );
  }
}

export default App;
