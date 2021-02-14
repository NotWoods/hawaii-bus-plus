import { StationInformation, Stop } from '@hawaii-bus-plus/types';

interface LatLngLike {
  lat: number;
  lng: number;
}

interface BasePoint {
  type: 'user' | 'stop' | 'place' | 'marker' | 'bike';
  name?: string;
  position: LatLngLike;
}

export interface StopPoint extends Partial<BasePoint> {
  type: 'stop';
  stopId: Stop['stop_id'];
}

export interface PlacePointPartial extends Partial<BasePoint> {
  type: 'place';
  placeId: string;
}

export interface PlacePoint extends PlacePointPartial {
  position: LatLngLike;
}

export interface UserPoint extends BasePoint {
  type: 'user';
  name?: undefined;
}

export interface MarkerPoint extends BasePoint {
  type: 'marker';
}

export interface BikeStationPoint extends BasePoint {
  type: 'bike';
  stationId: StationInformation['station_id'];
}

export type Point =
  | StopPoint
  | PlacePoint
  | UserPoint
  | MarkerPoint
  | BikeStationPoint;
