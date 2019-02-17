import React, { Component } from 'react';
import { Button, Card } from 'antd';
import { Bounty } from '../definitions/entities/entities';
import { any } from 'prop-types';

interface IAdminPageProps {
  web3: any;
  sendRoyaltyDistribution: () => void;
  getUserPastEvents: (userAddress: string) => void;
  getBounties: () => Promise<Bounty[]>;
  acceptFufillment: (
    bountyId: any,
    fulfillmentId: any,
    percentage: number
  ) => void;
}

class AdminPage extends Component<IAdminPageProps> {
  state = {
    bountyId: any,
    fulfillmentId: any,
    percentage: any
  };

  constructor(props: IAdminPageProps) {
    super(props);
    this.acceptSubmission = this.acceptSubmission.bind(this);
    this.distributePayouts = this.distributePayouts.bind(this);
  }

  distributePayouts() {
    this.props.sendRoyaltyDistribution();
    console.log('button clicked');
  }

  acceptSubmission() {
    this.props.acceptFufillment(1, 0, 25);
    console.log('button clicked');
  }

  render() {
    return (
      <div>
        <Card title="Admin Page" bordered={false} style={{ width: '100%' }}>
          <p>Card content</p>
          <Button onClick={this.distributePayouts}>Distribute Payouts</Button>
          <Button onClick={this.acceptSubmission}>Accept Submission</Button>
        </Card>
      </div>
    );
  }
}
export default AdminPage;
