export interface UserMetadata {
  name: string;
  bio: string;
  imgUrl: string;
}

export interface User {
  address: string;
  bountiesWon: any;
  royaltiesWon: string;
  metadata: UserMetadata;
}

export interface BountyMetadata {
  title: string;
  description: string;
}

export interface Bounty {
  issuer: string;
  deadline: any;
  data: string;
  fulfillmentAmount: any;
  arbiter: string;
  paysTokens: boolean;
  bountyStage: number;
  balance: number;
  metadata: BountyMetadata;
}

export enum BountyStages {
  Draft,
  Active,
  Dead
}
