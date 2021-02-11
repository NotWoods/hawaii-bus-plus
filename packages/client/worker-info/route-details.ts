import { getSingle, Repository } from '@hawaii-bus-plus/data';
import { nowWithZone } from '@hawaii-bus-plus/utils';
import {
  durationToData,
  formatPlainTime,
  StopTimeData,
} from '@hawaii-bus-plus/presentation';
import { Agency, ColorString, Route, Stop } from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';
import { LatLngBounds, LatLngBoundsLiteral } from 'spherical-geometry-js';
import { DirectionDetails, findBestTrips, zonedTime } from './trip-details';

export interface RouteDetails {
  readonly route: Route;
  readonly agency: Agency;
  readonly descParts: {
    type: 'text' | 'link';
    value: string;
  }[];
  readonly stops: ReadonlyMap<Stop['stop_id'], ColorString>;
  readonly bounds?: LatLngBoundsLiteral;

  readonly directions: DirectionDetails[];
}

const LINK_REGEX = /(https?:)\s?(\/\/[.a-z/]+)/g;

export function extractLinks(description: string) {
  let descLastIndex = 0;
  const descParts: RouteDetails['descParts'] = [];
  for (const match of description.matchAll(LINK_REGEX)) {
    const end = match.index! + match[0].length;
    const textPart = description.slice(descLastIndex, match.index);
    const linkPart = match[1] + match[2];
    descParts.push(
      { type: 'text', value: textPart },
      { type: 'link', value: linkPart }
    );
    descLastIndex = end;
  }
  descParts.push({
    type: 'text',
    value: description.slice(descLastIndex),
  });
  return descParts;
}

async function routeStopDetails(
  repo: Pick<Repository, 'loadRoutes' | 'loadStops'>,
  routeStops: Iterable<Stop['stop_id']>,
  loadedRoute: Route['route_id']
) {
  const stops: ReadonlyMap<Stop['stop_id'], Stop> = await repo.loadStops(
    routeStops
  );

  let bounds: LatLngBounds | undefined;
  for (const stop of stops.values()) {
    if (bounds) {
      bounds.extend(stop.position);
    } else {
      bounds = new LatLngBounds(stop.position, stop.position);
    }
  }

  const routeIds = new Set(
    Array.from(stops.values()).flatMap((stop) => stop.routes)
  );
  routeIds.delete(loadedRoute);
  const routes = await repo.loadRoutes(routeIds);

  return { stops, bounds, routes };
}

/**
 * Find the best trip based on the current time of day,
 * along with other route details.
 * @param trips All trips for a route.
 */
export async function getRouteDetails(
  repo: Pick<
    Repository,
    | 'loadRoutes'
    | 'loadAgencies'
    | 'loadTripsForRoute'
    | 'loadCalendars'
    | 'loadStops'
  >,
  routeId: Route['route_id'],
  now?: Temporal.PlainDateTime
): Promise<RouteDetails | undefined> {
  const allCalendarsReady = repo.loadCalendars();
  const route = await getSingle(repo, repo.loadRoutes, routeId);
  if (!route) {
    return undefined;
  }

  const agency = await getSingle(repo, repo.loadAgencies, route.agency_id);
  const timeZone = agency!.agency_timezone;

  const nowZoned = now ?? nowWithZone(timeZone);
  const nowDate = nowZoned.toPlainDate();

  const allCalendars = await allCalendarsReady;
  const { directionDetails, routeStops } = await findBestTrips(
    repo,
    routeId,
    allCalendars,
    nowZoned
  );

  const { stops, routes, bounds } = await routeStopDetails(
    repo,
    routeStops,
    routeId
  );
  routes.set(routeId, route);

  return {
    route,
    agency: agency!,
    descParts: extractLinks(route.route_desc),
    stops: new Map(Array.from(routeStops, (id) => [id, route.route_color])),
    bounds: bounds?.toJSON(),
    directions: directionDetails.map((dirDetails) => {
      const stopTimes: StopTimeData[] = dirDetails.closestTrip.trip.stop_times.map(
        (st) => {
          const stop = stops.get(st.stop_id)!;
          return {
            stop,
            routes: stop.routes
              .filter((id) => id !== routeId)
              .map((routeId) => routes.get(routeId)!),
            arrivalTime: zonedTime(st.arrival_time, nowDate, timeZone),
            departureTime: zonedTime(st.departure_time, nowDate, timeZone),
            timepoint: st.timepoint,
          };
        }
      );

      for (const slice of dirDetails.allTrips.values()) {
        const data = zonedTime(slice.time, nowDate, timeZone);
        slice.shortName = formatPlainTime(data, timeZone).agencyTime;
      }

      return {
        firstStop: dirDetails.firstStop,
        firstStopName: stops.get(dirDetails.firstStop)!.stop_name,
        lastStop: dirDetails.lastStop,
        lastStopName: stops.get(dirDetails.lastStop)!.stop_name,
        earliest: zonedTime(dirDetails.earliest, nowDate, timeZone),
        latest: zonedTime(dirDetails.latest, nowDate, timeZone),
        allTrips: dirDetails.allTrips,
        closestTrip: {
          trip: dirDetails.closestTrip.trip,
          offset: durationToData(dirDetails.closestTrip.offset),
          stop: dirDetails.closestTrip.stop,
          stopName: stops.get(dirDetails.closestTrip.stop)!.stop_name,
          serviceDays: allCalendars.get(dirDetails.closestTrip.trip.service_id)
            ?.service_name,
          stopTimes,
        },
      };
    }),
  };
}
