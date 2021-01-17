import { Stop } from '../shared/gtfs-types';

export interface Repository {
  getStop(stop_id: Stop['stop_id']): Promise<Stop>;
}
