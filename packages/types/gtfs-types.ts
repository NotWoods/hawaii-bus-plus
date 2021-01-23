import { Opaque } from 'type-fest';
import { DateString, TimeString } from './data-types';

export interface GTFSData {
  routes: { [route_id: string]: RouteWithTrips };
  stops: { [stop_id: string]: Stop };
  calendar: { [service_id: string]: Calendar };
  agency: { [agency_id: string]: Agency };
  info: FeedInfo;
}

/* Server needs to iterate through all trips, client doesn't. */
export interface ServerGTFSData extends GTFSData {
  trips: { [trip_id: string]: Route['route_id'] };
}

export interface CsvCalendar {
  service_id: Opaque<string, 'calendar'>;
  service_name: string;
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
    Pick<CsvCalendar, 'service_id' | 'service_name' | 'start_date' | 'end_date'>
  > {
  readonly days: readonly [
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean,
    sunday: boolean
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
  route_id: Opaque<string, 'route'>;
  route_short_name: string;
  route_long_name: string;
  route_desc: string;
  route_type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  route_color: string;
  route_text_color: string;
  agency_id?: Agency['agency_id'];
  route_url: string;
  route_sort_order: number;
}

export interface Route extends Readonly<CsvRoute> {
  readonly agency_id: Agency['agency_id'];
}

export interface RouteWithTrips extends Route {
  readonly trips: { [trip_id: string]: Trip };
}

export interface CsvTrip {
  route_id: Route['route_id'];
  service_id: Calendar['service_id'];
  trip_id: Opaque<string, 'trip'>;
  direction_id: 0 | 1;
  trip_short_name: string;
  trip_headsign: string;
}

export interface Trip extends Readonly<CsvTrip> {
  /**
   * Stop times, sorted by `stop_sequence`.
   */
  readonly stop_times: StopTime[];
}

export interface CsvStop {
  stop_id: Opaque<string, 'stop'>;
  stop_name: string;
  stop_desc: string;
  stop_lat: number;
  stop_lon: number;
}

export interface Stop extends Readonly<Omit<CsvStop, 'stop_lat' | 'stop_lon'>> {
  readonly position: {
    readonly lat: number;
    readonly lng: number;
  };
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
  agency_id: Opaque<string, 'agency'>;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang: string;
  agency_phone: string;
  agency_email: string;
  agency_fare_url: string;
}

export interface Agency extends Readonly<CsvAgency> {}
