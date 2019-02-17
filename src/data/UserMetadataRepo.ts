import { User, UserMetadata } from '../definitions/entities/entities';

export class UserMetadataRepo {
  private data: Map<string, UserMetadata>;
  constructor() {
    this.data = new Map<string, UserMetadata>();

    //Dummy Data
    this.set('0x05C95b1830EC6D511Cab7da8eAbA9b23a8ab10A4', {
      name: 'Name',
      bio: 'BIO',
      imgUrl: 'asd'
    });
  }

  get(userId: string) {
    return this.data.get(userId);
  }

  set(userId: string, data: UserMetadata) {
    this.data.set(userId, data);
  }
}
