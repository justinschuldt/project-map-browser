import React, { Component } from 'react';
import './App.less';

import { Button } from 'antd';
var HDWalletProvider = require('truffle-hdwallet-provider');
import gisWalletMnemonic from '../src/config/keys';

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
  UserMetadata,
  RoyaltyFinancesData,
  RoyaltyDistribution,
  RoyaltyOwnerInfo
} from './definitions/entities/entities';
import { UserMetadataRepo } from './data/UserMetadataRepo';
import { BountyMetadataRepo } from './data/BountyMetadataRepo';
import { MapRepo } from './data/MapRepo';

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
  // Web3
  portis?: Portis;
  web3?: Web3;
  userLoggedIn = false;

  // Contracts
  standardBountiesInstance?: any;
  tokenInstance?: any;

  contractsConnected?: any;

  // Database Interfaces
  userMetadataRepo?: UserMetadataRepo = new UserMetadataRepo();
  bountyMetadataRepo?: BountyMetadataRepo = new BountyMetadataRepo();
  mapDataRepo?: MapRepo = new MapRepo();

  constructor(props: any) {
    super(props);
    this.portisClicked = this.portisClicked.bind(this);
    this.blocknativeClicked = this.blocknativeClicked.bind(this);

    // Default INFURA provider for read access
    this.setWeb3(
      new Web3(
        new Web3.providers.HttpProvider(
          `https://rinkeby.infura.io/${process.env.REACT_APP_INFURA_API_KEY}`
        )
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

    this.setWeb3(new Web3(portis.provider));
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

  async setWeb3(web3: Web3) {
    if (web3) {
      this.web3 = web3;
      console.log('web3 available');
      web3.eth.getAccounts((error, accounts) => {
        console.log(accounts);
      });

      this.initContractInstances();
    }
  }

  // @ts-ignore
  async connectToMetamask() {
    // Modern dapp browsers...
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      this.setWeb3(new Web3(ethereum));
      try {
        // Request account access if needed
        // @ts-ignore
        await ethereum.enable();
        // Acccounts now exposed
        // @ts-ignore
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    // @ts-ignore
    else if (window.web3) {
      // @ts-ignore
      this.setWeb3(new Web3(web3.currentProvider));
      // Acccounts always exposed
      // @ts-ignore
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  }

  async submitBounty(bountyId: number, data: any) {
    this.standardBountiesInstance.methods
      .fulfillBounty()
      // @ts-ignore
      .send({ from: this.web3.eth.accounts[0] });
  }

  async initContractInstances() {
    if (!this.web3) {
      return;
    }
    this.standardBountiesInstance = new this.web3.eth.Contract(
      StandardBountiesAbi as any,
      process.env.REACT_APP_STANDARD_BOUNTIES_ADDRESS
    );

    this.tokenInstance = new this.web3.eth.Contract(
      HumanStandardTokenAbi as any,
      process.env.REACT_APP_TOKEN_ADDRESS
    );

    console.log('contract instances init');

    this.contractsConnected = true;

    await this.getBounties();
    await this.getAllRoyaltyDistributions();
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

  // Users can submit data to a bounty - requires a logged in user.
  async fulfillBounty(bountyId: number, data: any) {
    if (!this.userLoggedIn) {
      return;
    }

    const fulfillmentId = await this.standardBountiesInstance.methods
      .fulfillBounty()
      .send(bountyId, data);
    console.log(fulfillmentId);

    this.acceptFulfillment(bountyId, fulfillmentId, 25);
  }

  async acceptFulfillment(
    bountyId: any,
    fulfillmentId: any,
    percentage: number
  ) {
    await this.standardBountiesInstance.methods
      .acceptFulfillmentPartial(bountyId, fulfillmentId, percentage)
      .send({ from: process.env.REACT_APP_GIS_CORPS_ADDRESS });

    await this.getAllRoyaltyDistributions();
  }

  // Royalty Distribution

  async sendRoyaltyDistribution() {
    const distrubtions = await this.getAllRoyaltyDistributions();

    let payees = [];
    let values = [];
    let bountyIds = [];

    for (let i = 0; i < distrubtions.length; i++) {
      payees.push(distrubtions[i].address);
      values.push(distrubtions[i].value);
      bountyIds.push(distrubtions[i].bountyId);
    }
  }

  async getAllRoyaltyDistributions(): Promise<Array<RoyaltyDistribution>> {
    let allDistributions: Array<RoyaltyDistribution> = [];

    const numBounties = await this.standardBountiesInstance.methods
      .getNumBounties()
      .call();

    console.log('numBounties', numBounties);

    for (let i = 0; i < numBounties; i++) {
      const distributions = await this.calculateRoyaltyDistribution(i);
      allDistributions.push(...distributions);
    }

    console.log('All distributions', allDistributions);
    return allDistributions;
  }

  async calculateRoyaltyDistribution(
    i: number
  ): Promise<Array<RoyaltyDistribution>> {
    let royaltyFinances: RoyaltyFinancesData = {} as RoyaltyFinancesData;

    const financesData = await this.standardBountiesInstance.methods
      .getRoyaltyFinances(i)
      .call();

    console.log(financesData);

    royaltyFinances.initialFunding = financesData[0];
    royaltyFinances.balance = financesData[1];
    royaltyFinances.distributionPercent = financesData[2];

    const royaltyOwners = await this.getRoyaltyOwners(i);

    let royaltyDistributions: Array<RoyaltyDistribution> = [];

    //Add bounty Id
    for (let owner of royaltyOwners) {
      royaltyDistributions.push({
        address: owner.address,
        value: owner.value,
        bountyId: i
      });
    }

    console.log(royaltyOwners);
    return royaltyDistributions;
  }

  async getRoyaltyOwners(bountyId: number) {
    let royaltyOwners: Array<RoyaltyOwnerInfo> = [];

    const numRoyalties = await this.standardBountiesInstance.methods
      .getRoyaltyOwnerCount(bountyId, 0)
      .call();

    for (let i = 0; i < numRoyalties; i++) {
      const ownerInfo = await this.standardBountiesInstance.methods
        .getRoyaltyOwner(bountyId, i)
        .call();

      console.log('ownerInfo found', ownerInfo);
      royaltyOwners.push({
        address: ownerInfo[0],
        value: ownerInfo[1]
      });
    }

    return royaltyOwners;
  }

  // Database Functions

  async getBountyMetadata(key: string): Promise<BountyMetadata> {
    const dummyData: BountyMetadata = {
      title: 'Bounty Title',
      description: 'Bounty Description'
    };

    if (!this.bountyMetadataRepo) {
      return dummyData;
    }

    return this.bountyMetadataRepo.get(key) || dummyData;
  }
  async getUserMetadata(key: string): Promise<UserMetadata> {
    const dummyData: UserMetadata = {
      name: 'Test User',
      bio: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
      imgUrl: ''
    };

    if (!this.userMetadataRepo) {
      return dummyData;
    }

    return this.userMetadataRepo.get(key) || dummyData;
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
