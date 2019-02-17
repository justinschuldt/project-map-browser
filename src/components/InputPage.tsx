import React, { Component } from 'react';
import InputMapContainer from './InputMapContainer';
import { Feature, mockData } from '../data/AOI_JSON';
import { Bounty } from '../definitions/entities/entities';

const mockDataFindById = (id: number) => {
  const { features } = mockData;
  return features.find(f => f.properties.fid === Number(id));
};

interface IInputPageProps {
  match: any;
  web3: any;
  submitBounty?: (bountyId: number, data: any) => void;
  getBounty: (bountyId: number) => Promise<Bounty>;
}

export class InputPage extends Component<IInputPageProps> {
  state: {
    feature: Feature;
  };
  constructor(props: IInputPageProps) {
    super(props);
    this.state = {
      feature: mockDataFindById(props.match.params.id) as Feature
    };
    this.submitBounty = this.submitBounty.bind(this);
  }
  componentWillMount() {
    const feature = mockDataFindById(this.props.match.params.id);
    this.setState(() => ({
      feature
    }));
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
    if (!this.state.feature) {
      return null;
    }
    return (
      <InputMapContainer
        inputComplete={this.submitBounty}
        feature={this.state.feature}
      />
    );
    return <InputMapContainer inputComplete={this.submitBounty} />;
  }
}

export default InputPage;
