import { User, BountyMetadata } from '../definitions/entities/entities';

export class BountyMetadataRepo {
  private data: Map<string, BountyMetadata>;
  constructor() {
    this.data = new Map<string, BountyMetadata>();
  }

  get(id: string) {
    return this.data.get(id);
  }

  set(id: string, data: BountyMetadata) {
    this.data.set(id, data);
  }
}
