import { Stop } from '@hawaii-bus-plus/types';

interface LatLngLike {
  lat: number;
  lng: number;
}

interface BasePoint {
  type: 'user' | 'stop' | 'place' | 'marker';
  name?: string;
  position: LatLngLike;
}

export interface StopPoint extends Partial<BasePoint> {
  type: 'stop';
  stopId: Stop['stop_id'];
}

export interface PlacePoint extends BasePoint {
  type: 'place';
  placeId: string;
}

export interface UserPoint extends BasePoint {
  type: 'user';
  name?: undefined;
}

export interface MarkerPoint extends BasePoint {
  type: 'marker';
}

export type Point = StopPoint | PlacePoint | UserPoint | MarkerPoint;
