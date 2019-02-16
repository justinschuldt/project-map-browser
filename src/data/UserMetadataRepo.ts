import { User, UserMetadata } from '../definitions/entities/entities';

export class UserMetadataRepo {
  private data: Map<string, UserMetadata>;
  constructor() {
    this.data = new Map<string, UserMetadata>();
  }

  get(userId: string) {
    return this.data.get(userId);
  }

  set(userId: string, data: UserMetadata) {
    this.data.set(userId, data);
  }
}
