import React, { Component } from 'react';
import InputMapContainer from './InputMapContainer';
import { Bounty } from '../definitions/entities/entities';
import { BountyMapContainer } from './BountyMapContainer';

interface IInputPageProps {
  match: any;
  web3: any;
  submitBounty?: (bountyId: number, data: any) => void;
  getBounty: (bountyId: number) => Promise<Bounty>;
}

export class InputPage extends Component<IInputPageProps> {
  constructor(props: IInputPageProps) {
    super(props);
    this.submitBounty = this.submitBounty.bind(this);
    this.loadBountyInfo();
  }

  async loadBountyInfo() {
    const bounty = await this.props.getBounty(this.props.match.params.id);
    this.setState({ bounty: bounty });
  }

  submitBounty(geoData: any) {
    console.log('InputPage.submitBounty() geoData: ', geoData);
    if (this.props.submitBounty) {
      this.props.submitBounty(this.props.match.params.id, geoData);
    }
  }
  render() {
    console.log(
      `inputPage rendered for bountyId: ${this.props.match.params.id}`
    );
    return <InputMapContainer inputComplete={this.submitBounty} />;
  }
}

export default InputPage;
