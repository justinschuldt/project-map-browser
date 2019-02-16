import { GeoData } from './AOI_JSON';
import { User, BountyMetadata } from '../definitions/entities/entities';

export class MapRepo {
  private data: Map<string, GeoData[]>;
  constructor() {
    this.data = new Map<string, GeoData[]>();
  }

  getMapData(id: string): GeoData[] {
    return this.data.get(id) || ([] as GeoData[]);
  }

  setMapData(id: string, data: GeoData[]) {
    this.data.set(id, data);
  }

  addDataToMap(id: string, dataToAdd: GeoData[]) {
    let currentData = this.data.get(id);
    if (currentData) {
      currentData.push(...dataToAdd);
    } else {
      this.setMapData(id, dataToAdd);
    }
  }
}
