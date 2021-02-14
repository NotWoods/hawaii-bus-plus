import { Opaque } from 'type-fest';
import { LatLngData } from './gtfs-types';

export type RentalMethod =
  | 'KEY'
  | 'CREDITCARD'
  | 'PAYPASS'
  | 'APPLEPAY'
  | 'ANDROIDPAY'
  | 'TRANSITCARD'
  | 'ACCOUNTNUMBER'
  | 'PHONE';

export interface GbfsWrapper<T> {
  last_updated: number;
  ttl: number;
  version: string;
  data: T;
}

export interface JsonFeed {
  name: string;
  url: string;
}

/**
 * @see https://gbfs.mobilitydata.org/specification#h.jltap5k3s828
 */
export interface JsonStationInformation {
  station_id: Opaque<string, 'bike_station'>;
  name: string;
  physical_configuration?: string;
  lat: number;
  lon: number;
  address?: string;
  post_code?: string;
  capacity?: number;
  rental_methods?: RentalMethod[];
  groups?: string[];
}

export interface StationInformation
  extends Readonly<
    Omit<
      JsonStationInformation,
      'physical_configuration' | 'groups' | 'lat' | 'lon'
    >
  > {
  region_id?: string;
  position: LatLngData;
}
