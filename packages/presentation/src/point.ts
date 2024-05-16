import type { StationInformation, Stop } from '@hawaii-bus-plus/types';

interface LatLngLike {
  lat: number;
  lng: number;
}

export const STOP_POINT_TYPE = 'stop';
export const PLACE_POINT_TYPE = 'place';
export const USER_POINT_TYPE = 'user';
export const MARKER_POINT_TYPE = 'marker';
export const BIKE_POINT_TYPE = 'bike';

interface BasePoint {
  type: string;
  name?: string;
  position: LatLngLike;
}

export interface StopPoint extends Partial<BasePoint> {
  type: typeof STOP_POINT_TYPE;
  stopId: Stop['stop_id'];
}

export interface PlacePointPartial extends Partial<BasePoint> {
  type: typeof PLACE_POINT_TYPE;
  placeId: string;
}

export interface PlacePoint extends PlacePointPartial {
  position: LatLngLike;
}

export interface UserPoint extends BasePoint {
  type: typeof USER_POINT_TYPE;
  name?: undefined;
}

export interface MarkerPoint extends BasePoint {
  type: typeof MARKER_POINT_TYPE;
}

export interface BikeStationPoint extends BasePoint {
  type: typeof BIKE_POINT_TYPE;
  stationId: StationInformation['station_id'];
}

export type Point =
  | StopPoint
  | PlacePoint
  | UserPoint
  | MarkerPoint
  | BikeStationPoint;
