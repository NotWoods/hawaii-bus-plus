import { Opaque } from 'type-fest';

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
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  start_date: string;
  end_date: string;
}

export interface Calendar
  extends Readonly<
    Pick<CsvCalendar, 'service_id' | 'start_date' | 'end_date'>
  > {
  readonly days: readonly [
    sunday: boolean,
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean
  ];
  readonly text_name: string;
}

export interface CsvCalendarDates {
  service_id: Calendar['service_id'];
  date: string;
  exception_type: number;
}

export interface CsvRoute {
  route_id: Opaque<string, 'route'>;
  route_short_name: string;
  route_long_name: string;
  route_desc: string;
  route_type: number;
  route_color: string;
  route_text_color: string;
  agency_id?: string;
  route_url: string;
  route_sort_order: number;
}

export interface Route extends Readonly<CsvRoute> {
  readonly agency_id: string;
}

export interface RouteWithTrips extends Route {
  readonly trips: { [trip_id: string]: Trip };
}

export interface CsvTrip {
  route_id: Route['route_id'];
  service_id: Calendar['service_id'];
  trip_id: string;
  direction_id: number;
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
  readonly trips: {
    readonly trip: Trip['trip_id'];
    readonly dir: number;
    readonly route: Route['route_id'];
    readonly sequence: number;
    readonly time: string;
  }[];
  readonly routes: Route['route_id'][];
  readonly transfers: readonly Stop['stop_id'][];
}

export interface CsvStopTime {
  trip_id: Trip['trip_id'];
  arrival_time: string;
  departure_time: string;
  stop_id: Stop['stop_id'];
  stop_sequence: number;
  pickup_type: number;
  drop_off_type: number;
  continuous_pickup: number;
  continuous_drop_off: number;
  timepoint: number;
}

export interface StopTime
  extends Readonly<
    Omit<
      CsvStopTime,
      'trip_id' | 'continuous_drop_off' | 'drop_off_type' | 'timepoint'
    >
  > {
  readonly timepoint: boolean;
}

export interface CsvTransfer {
  readonly from_stop_id: Stop['stop_id'];
  readonly to_stop_id: Stop['stop_id'];
  readonly transfer_type: number;
}

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

export interface Agency
  extends Readonly<Omit<CsvAgency, 'agency_timezone' | 'agency_lang'>> {}
