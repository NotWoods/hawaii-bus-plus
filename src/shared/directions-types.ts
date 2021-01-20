import { Opaque } from 'type-fest';
import { Stop, Trip } from './gtfs-types';

export interface DirectionsData {
  routes: { [id: string]: DirectionRoute };
  stops: { [id: string]: DirectionStop };
}

export interface DirectionRoute {
  readonly id: Opaque<string, 'direction-route'>;
  readonly trips: Trip[];
  readonly stops: Set<Stop['stop_id']>;
}

export interface DirectionStop {
  readonly id: Stop['stop_id'];
  readonly routes: StopRouteInfo[];
}
export interface StopRouteInfo {
  readonly route_id: DirectionRoute['id'];
  readonly sequence: number;
}
