import type { Opaque } from 'type-fest';
import type { ColorString, DateString, TimeString } from './data-types.js';
import type { StationInformation } from './gbfs-types.js';

export type ServiceId = Opaque<string, 'calendar'>;
export type RouteId = Opaque<string, 'route'>;
export type TripId = Opaque<string, 'trip'>;
export type BlockId = Opaque<string, 'block'>;
export type StopId = Opaque<string, 'stop'>;
export type AgencyId = Opaque<string, 'agency'>;
export type ShapeId = Opaque<string, 'shape'>;

export interface GTFSData {
  routes: { [route_id: string]: Route };
  stops: { [stop_id: string]: Stop };
  calendar: { [service_id: string]: Calendar };
  agency: { [agency_id: string]: Agency };
  bike_stations: { [station_id: string]: StationInformation };
  trips: Trip[];
  info: FeedInfo;
}

export interface CsvCalendar {
  service_id: ServiceId;
  service_name?: string;
  Package?: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  start_date: DateString;
  end_date: DateString;
}

export interface Calendar
  extends Readonly<
    Pick<CsvCalendar, 'service_id' | 'start_date' | 'end_date'>
  > {
  readonly service_name: string;
  readonly days: readonly [
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean,
  ];
  readonly added_dates: readonly DateString[];
  readonly removed_dates: readonly DateString[];
}

export interface CsvCalendarDates {
  service_id: Calendar['service_id'];
  date: DateString;
  exception_type: 1 | 2;
}

export interface CsvRoute {
  route_id: RouteId;
  route_short_name: string;
  route_long_name: string;
  route_desc: string;
  route_type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  route_color: ColorString;
  route_text_color: ColorString;
  agency_id?: Agency['agency_id'];
  route_url: string;
  route_sort_order: number;
  direction_0: string;
  direction_1: string;
}

export interface Route
  extends Readonly<Omit<CsvRoute, 'direction_0' | 'direction_1'>> {
  readonly agency_id: Agency['agency_id'];
  readonly directions: {
    0?: string;
    1?: string;
  };
}

export interface CsvTrip {
  route_id: Route['route_id'];
  service_id: Calendar['service_id'];
  trip_id: TripId;
  block_id: BlockId;
  shape_id?: Shape['shape_id'];
  direction_id: 0 | 1;
  trip_short_name: string;
  trip_headsign: string;
}

export type TripWithoutTimes = Readonly<CsvTrip>;

export interface Trip extends TripWithoutTimes {
  /**
   * Stop times, sorted by `stop_sequence`.
   */
  readonly stop_times: StopTime[];
}

export interface CsvStop {
  stop_id: StopId;
  stop_name: string;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
}

export interface LatLngData {
  readonly lat: number;
  readonly lng: number;
}

export interface Stop extends Readonly<Omit<CsvStop, 'stop_lat' | 'stop_lon'>> {
  readonly position: LatLngData;
  readonly routes: Route['route_id'][];
  readonly transfers: readonly Transfer[];
}

export interface CsvStopTime {
  trip_id: Trip['trip_id'];
  arrival_time: TimeString;
  departure_time: TimeString;
  stop_id: Stop['stop_id'];
  stop_sequence: number;
  pickup_type: 0 | 1 | 2 | 3;
  drop_off_type: 0 | 1 | 2 | 3;
  continuous_pickup: 0 | 1 | 2 | 3;
  continuous_drop_off: 0 | 1 | 2 | 3;
  timepoint: boolean;
  shape_dist_traveled?: number;
}

export type StopTime = Readonly<
  Omit<CsvStopTime, 'continuous_drop_off' | 'drop_off_type'>
>;

export interface CsvTransfer {
  from_stop_id: Stop['stop_id'];
  to_stop_id: Stop['stop_id'];
  transfer_type: 0 | 1 | 2 | 3;
  min_transfer_time?: number;
}

export type Transfer = Readonly<CsvTransfer>;

export interface FeedInfo {
  readonly feed_publisher_name: string;
  readonly feed_publisher_url: string;
  readonly feed_start_date: string;
  readonly feed_version: string;
  readonly feed_contact_email: string;
  readonly feed_contact_url: string;
}

export interface CsvAgency {
  agency_id: AgencyId;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang: string;
  agency_phone: string;
  agency_email: string;
  agency_fare_url: string;
}

export interface Agency extends Readonly<CsvAgency> {
  readonly agency_short_name: string;
  readonly primary: boolean;
}

export interface CsvShape {
  shape_id: ShapeId;
  shape_pt_lat: number;
  shape_pt_lon: number;
  shape_pt_sequence: number;
  shape_dist_traveled: number;
}

export interface Shape {
  readonly shape_id: CsvShape['shape_id'];
  readonly points: ShapePoint[];
}

export interface ShapePoint {
  readonly position: LatLngData;
  readonly shape_dist_traveled: number;
}
