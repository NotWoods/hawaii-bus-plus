import { omitStopTimes, Repository } from '@hawaii-bus-plus/data';
import {
  durationToData,
  PlainTimeData,
  plainTimeToData,
  Point,
  StopTimeData,
  Walking,
} from '@hawaii-bus-plus/presentation';
import { Agency, Route, Stop, Trip } from '@hawaii-bus-plus/types';
import { PlainDaysTime } from '@hawaii-bus-plus/utils';
import { findLastIndex, last } from 'lodash';
import { add } from 'mnemonist/set';
import { Temporal } from 'proposal-temporal';
import { computeDistanceBetween } from 'spherical-geometry-js';
import { stopsLoader } from './footpaths';
import { CompletePath, PathSegment, PathTripSegment } from './raptor';

interface JourneyStopTime {
  readonly stop: Stop;
  readonly arrivalTime: PlainDaysTime;
  readonly departureTime: PlainDaysTime;
  readonly timepoint: boolean;
}

export interface JourneyTripSegment {
  readonly trip: Omit<Trip, 'stop_times'>;
  readonly route: Route;
  readonly agency: Agency;
  readonly stopTimes: readonly StopTimeData[];
}

export interface Journey {
  depart?: {
    /**
     * Starting or ending point for directions.
     * Includes some styling information for presentation in
     * text box & direction results.
     */
    point: Point;
    walk: Walking;
  };
  trips: (JourneyTripSegment | Walking)[];
  arrive?: {
    point: Point;
    walk: Walking;
  };
}

function formatDepartArrive(
  point: Point,
  walkToFrom: google.maps.LatLngLiteral,
  waitUntil?: Temporal.Duration
) {
  if (point.type === 'stop') return undefined;

  const distance = computeDistanceBetween(point.position, walkToFrom);
  const time = Temporal.Duration.from({ seconds: distance });
  const walk: Walking = { distance, time: durationToData(time) };

  if (waitUntil) {
    walk.waitUntil = durationToData(waitUntil);
  }

  return { point, walk };
}

function isPathTripSegment(segment: PathSegment): segment is PathTripSegment {
  return (segment as PathTripSegment).trip != undefined;
}

export async function journeyToDirections(
  repo: Pick<
    Repository,
    'loadStops' | 'loadTrip' | 'loadRoutes' | 'loadAgency'
  >,
  from: Point,
  to: Point,
  departureTime: Temporal.PlainDateTime,
  path: CompletePath
): Promise<Journey> {
  const getStops = stopsLoader(repo);

  const departureDaysTime = new PlainDaysTime(0, departureTime.toPlainTime());
  const departureDate = departureTime.toPlainDate();

  function zonedTime(
    time: PlainDaysTime,
    timeZone: string | Temporal.TimeZoneProtocol
  ): PlainTimeData {
    return plainTimeToData(time, departureDate, timeZone);
  }

  const pathSegments = path.slice(1) as readonly PathSegment[];

  const trips: (JourneyTripSegment | Walking)[] = [];
  let lastDepartureTime = departureDaysTime;
  let startEntry: JourneyStopTime | undefined;
  let endEntry: JourneyStopTime | undefined;
  for (const current of pathSegments) {
    if (isPathTripSegment(current)) {
      // Lookup trip and get stop times
      const trip = await repo.loadTrip(current.trip);
      if (!trip) {
        throw new Error(`Invalid trip ID ${current.trip}`);
      }

      // TODO optimize
      const lastSTIndex = trip.stop_times.findIndex(
        (st) =>
          current.stopTime.stop_id === st.stop_id &&
          current.stopTime.stop_sequence === st.stop_sequence
      );
      const firstSTIndex = findLastIndex(
        trip.stop_times,
        (st) => st.stop_id === current.transferFrom,
        lastSTIndex
      );
      const rawStopTimes = trip.stop_times.slice(firstSTIndex, lastSTIndex + 1);

      const stops = await getStops(rawStopTimes.map((st) => st.stop_id));
      const routeIds = new Set([trip.route_id]);
      const formattedStopTimes: JourneyStopTime[] = rawStopTimes.map((st) => {
        const stop = stops.get(st.stop_id)!;
        add(routeIds, new Set(stop.routes));

        return {
          stop,
          arrivalTime: PlainDaysTime.from(st.arrival_time),
          departureTime: PlainDaysTime.from(st.departure_time),
          timepoint: st.timepoint,
        };
      });

      // Update every iteration so we only keep the last result
      lastDepartureTime = formattedStopTimes[0].departureTime;
      endEntry = last(formattedStopTimes);
      // Set on first iteration
      if (!startEntry) {
        startEntry = formattedStopTimes[0];
      }

      const routes = await repo.loadRoutes(routeIds);
      const route = routes.get(trip.route_id);
      if (!route) {
        throw new Error(`Invalid route ID ${trip.route_id}`);
      }

      const agency = await repo.loadAgency(route.agency_id);
      if (!agency) {
        throw new Error(`Invalid agency ID ${route.agency_id}`);
      }

      trips.push({
        trip: omitStopTimes(trip),
        route,
        agency,
        stopTimes: formattedStopTimes.map((st) => ({
          stop: st.stop,
          routes: st.stop.routes.map((routeId) => routes.get(routeId)!),
          arrivalTime: zonedTime(st.arrivalTime, agency.agency_timezone),
          departureTime: zonedTime(st.departureTime, agency.agency_timezone),
          timepoint: st.timepoint,
        })),
      });
    } else {
      // Transfer by walking
      const startStopId = current.transferFrom;
      const endStopId = current.transferTo;
      const reachedEndStop = current.time;

      const stops = await getStops([startStopId, endStopId]);
      const startStop = stops.get(startStopId)!;
      const endStop = stops.get(endStopId)!;

      const distance = computeDistanceBetween(
        startStop.position,
        endStop.position
      );
      trips.push({
        time: durationToData(current.transferTime),
        waitUntil: durationToData(lastDepartureTime.until(reachedEndStop)),
        distance,
      });
    }
  }

  // Starting at (from)

  // Walk 1 minute

  // TRIP: waimea-waimea-pm-0-0
  // 301 - Waimea
  //   Start at Lakeland @ 12:30PM
  //     After 1 stop
  //   End at Parker Ranch @ 12:45PM

  // Get off and wait for X minutes

  // TRIP: kohala-kona-0645am-nkohala-waim-kona-1
  // 75 - North Kohala / Waimea / Kailua-Kona
  //   Start at Parker Ranch @ 3:25PM
  //     After 1 stop
  //   End at Hwy 12/250 Intersection @ 3:45PM

  // Walk 1 minute

  // Ending at (to)

  return {
    depart: formatDepartArrive(
      from,
      startEntry!.stop.position,
      departureDaysTime.until(startEntry!.arrivalTime)
    ),
    arrive: formatDepartArrive(to, endEntry!.stop.position),
    trips,
  };
}
