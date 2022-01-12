import { Repository } from '@hawaii-bus-plus/data';
import { StationInformation, Stop } from '@hawaii-bus-plus/types';

export interface MarkersResponse {
  stops: readonly Stop[];
  bikeStations: readonly StationInformation[];
}

export async function loadMarkers(
  repo: Pick<Repository, 'loadAllStops' | 'loadBikeStations'>,
): Promise<MarkersResponse> {
  const [stops, bikeStations] = await Promise.all([
    repo.loadAllStops(),
    repo.loadBikeStations(),
  ]);
  return { stops, bikeStations };
}
