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
  UserMetadata,
  RoyaltyFinancesData,
  RoyaltyDistribution,
  RoyaltyOwnerInfo
} from './definitions/entities/entities';
import { UserMetadataRepo } from './data/UserMetadataRepo';
import { BountyMetadataRepo } from './data/BountyMetadataRepo';
import { MapRepo } from './data/MapRepo';

class App extends Component {
  // Web3
  portis?: Portis;
  web3?: Web3;
  userLoggedIn = false;
  BN?: any;

  // Contracts
  standardBountiesInstance?: any;
  tokenInstance?: any;

  contractsConnected?: any;

  contractEvents?: any;

  // Database Interfaces
  userMetadataRepo?: UserMetadataRepo = new UserMetadataRepo();
  bountyMetadataRepo?: BountyMetadataRepo = new BountyMetadataRepo();
  mapDataRepo?: MapRepo = new MapRepo();

  constructor(props: any) {
    super(props);
    this.portisClicked = this.portisClicked.bind(this);
    this.blocknativeClicked = this.blocknativeClicked.bind(this);
    this.sendRoyaltyDistribution = this.sendRoyaltyDistribution.bind(this);
    this.getUserPastEvents = this.getUserPastEvents.bind(this);
    this.getBounties = this.getBounties.bind(this);
    this.acceptFulfillment = this.acceptFulfillment.bind(this);

    // Default INFURA provider for read access
    // this.setWeb3(
    //   new Web3(
    //     new Web3.providers.HttpProvider(
    //       `https://rinkeby.infura.io/${process.env.REACT_APP_INFURA_API_KEY}`
    //     )
    //   )
    // );

    this.connectToMetamask();

    console.log('web3 infura connected', this.web3);
  }

  portisClicked() {
    const portis = new Portis(
      'b3f16d56-4b6c-434b-9c90-9ce46d496013',
      'rinkeby'
    );

    this.portis = portis;
    this.userLoggedIn = true;
    console.log(this.portis);

    this.setWeb3(new Web3(portis.provider));
  }

  async blocknativeClicked() {
    const bnKey = 'd7603484-6a29-4dab-898b-f6a57f36e83d';
    const main = 1;
    const ropsten = 3;
    const rinkeby = 4;
    var assistInstance = assist.init({ dappId: bnKey, networkId: rinkeby });
    this.userLoggedIn = true;

    try {
      // onboard visitors
      const result = await assistInstance.onboard();
      console.log('result: ', result);
    } catch (error) {
      // user exited onboarding before completion
      console.log(error.msg);
    }
  }

  async subscribeToPastEvents() {
    console.log('subscribed to past events');
    this.standardBountiesInstance.getPastEvents(
      'BountyIssued',
      {
        fromBlock: 0,
        toBlock: 'latest'
      },
      // @ts-ignore
      (error, events) => {
        console.log('BountyIssued', events);
      }
    );

    this.standardBountiesInstance.getPastEvents(
      'BountyActivated',
      {
        fromBlock: 0,
        toBlock: 'latest'
      },
      // @ts-ignore
      (error, events) => {
        console.log('BountyActivated', events);
      }
    );

    this.standardBountiesInstance.getPastEvents(
      'BountyFulfilled',
      {
        fromBlock: 0,
        toBlock: 'latest'
      },
      // @ts-ignore
      (error, events) => {
        console.log('BountyFulfilled', events);
      }
    );

    this.standardBountiesInstance.getPastEvents(
      'FulfillmentAcceptedPartial',
      {
        fromBlock: 0,
        toBlock: 'latest'
      },
      // @ts-ignore
      (error, events) => {
        console.log('FulfillmentAcceptedPartial', events);
      }
    );

    this.standardBountiesInstance.getPastEvents(
      'RoyaltyFunded',
      {
        fromBlock: 0,
        toBlock: 'latest'
      },
      // @ts-ignore
      (error, events) => {
        console.log('RoyaltyFunded', events);
      }
    );

    this.standardBountiesInstance.getPastEvents(
      'PayoutGenerated',
      {
        fromBlock: 0,
        toBlock: 'latest'
      },
      // @ts-ignore
      (error, events) => {
        console.log('PayoutGenerated', events);
      }
    );
    this.standardBountiesInstance.getPastEvents(
      'OwnerAdded',
      {
        fromBlock: 0,
        toBlock: 'latest'
      },
      // @ts-ignore
      (error, events) => {
        console.log('OwnerAdded', events);
      }
    );
  }

  async getUserPastEvents(userAddress: string) {
    console.log('subscribed to user events', userAddress);
    this.standardBountiesInstance.getPastEvents(
      'PayoutGenerated',
      {
        filter: { owner: userAddress },
        fromBlock: 0,
        toBlock: 'latest'
      },
      // @ts-ignore
      (error, events) => {
        console.log('UserPast', events);
      }
    );
  }

  async setWeb3(web3: Web3) {
    if (web3) {
      this.web3 = web3;
      console.log('web3 available');
      // @ts-ignore
      this.BN = web3.utils.BN;
      web3.eth.getAccounts((error, accounts) => {
        console.log(accounts);
      });

      await this.initContractInstances();
      await this.subscribeToPastEvents();
      await this.getUserPastEvents(
        '0x8ECF64e7c55B0176e305F8e51E171A81C3D99B4B'
      );
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

  async getTokenBalance(address: string) {
    return await this.tokenInstance.methods.balanceOf(address);
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

    await this.sendRoyaltyDistribution();
  }

  // Royalty Distribution

  async sendRoyaltyDistribution() {
    if (!this.web3) {
      return;
    }
    const accounts = await this.web3.eth.getAccounts();
    console.log('attempting to send from', accounts[0] || '');

    const numBounties = await this.standardBountiesInstance.methods
      .getNumBounties()
      .call();

    console.log('numBounties', numBounties);

    for (let i = 0; i < numBounties; i++) {
      await this.standardBountiesInstance.methods
        .distributeRoyaltyFundsSimple(i)
        .send({ from: accounts[0] });
    }
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
          <LandingPage
            web3={this.web3}
            sendRoyaltyDistribution={this.sendRoyaltyDistribution}
            getUserPastEvents={this.getUserPastEvents}
            getBounties={this.getBounties}
            acceptFufillment={this.acceptFulfillment}
          />
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
