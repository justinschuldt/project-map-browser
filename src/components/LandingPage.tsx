import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AdminPage from './AdminPage';
import BountyMap from './BountyMapContainer';
import InputPage from './InputPage';
import UserPage from './UserPage';
import { Bounty } from '../definitions/entities/entities';

interface ILandingPageProps {
  web3: any;
  sendRoyaltyDistribution: () => void;
  getUserPastEvents: (userAddress: string) => void;
  getBounties: () => Promise<Bounty[]>;
  acceptFufillment: (
    bountyId: any,
    fulfillmentId: any,
    percentage: number
  ) => void;
  getBounty: (bountyId: number) => Promise<Bounty>;
  submitBounty?: (bountyId: number, data: any) => Promise<any>;
  kickoffBlocknative: () => void
}
class LandingPage extends Component<ILandingPageProps> {
  constructor(props: ILandingPageProps) {
    super(props);
  }
  render() {
    return (
      <div className="landing-page">
        <Router>
          <>
            <Route exact path="/" component={BountyMap} />
            <Route
              path="/bounty/:id"
              render={routerProps => (
                <InputPage
                  web3={this.props.web3}
                  match={routerProps.match}
                  submitBounty={this.props.submitBounty}
                  getBounty={this.props.getBounty}
                />
              )}
            />
            <Route
              path="/admin"
              render={routerProps => (
                <AdminPage
                  web3={this.props.web3}
                  sendRoyaltyDistribution={this.props.sendRoyaltyDistribution}
                  getUserPastEvents={this.props.getUserPastEvents}
                  getBounties={this.props.getBounties}
                  acceptFufillment={this.props.acceptFufillment}
                />
              )}
            />
            <Route
              path="/user"
              render={routerProps => (
                <UserPage
                  web3={this.props.web3}
                  getUserPastEvents={this.props.getUserPastEvents}
                  kickoffBlocknative={this.props.kickoffBlocknative}
                />
              )}
            />
          </>
        </Router>
      </div>
    );
  }
}

export default LandingPage;
