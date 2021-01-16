import { Stop } from '../shared/gtfs-types';

export interface Repository {
  getStop(stop_id: string): Promise<Stop>;
}
