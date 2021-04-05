import { Repository } from '@hawaii-bus-plus/data';
import { durationToData } from '@hawaii-bus-plus/presentation';
import { Agency, ColorString, Route, Stop } from '@hawaii-bus-plus/types';
import type { Temporal } from 'proposal-temporal';
import { LatLngBounds, LatLngBoundsLiteral } from 'spherical-geometry-js';
import { DescriptionPart, extractLinks } from './description';
import { loadCalendarAgency, routeStopDetails } from './shared';
import { FormatOptions, zonedTime } from './stop-time';
import {
  DirectionDetails,
  findBestTrips,
  formatTripDetails,
} from './trip-details';

export interface RouteDetails {
  readonly route: Route;
  readonly agency: Agency;
  readonly descParts: readonly DescriptionPart[];
  readonly stops: ReadonlyMap<Stop['stop_id'], ColorString>;
  readonly bounds?: LatLngBoundsLiteral;

  readonly directions: DirectionDetails[];
}

function routeBounds(stops: ReadonlyMap<Stop['stop_id'], Stop>) {
  let bounds: LatLngBounds | undefined;
  for (const stop of stops.values()) {
    if (bounds) {
      bounds.extend(stop.position);
    } else {
      bounds = new LatLngBounds(stop.position, stop.position);
    }
  }
  return bounds;
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
  date?: Temporal.PlainDate,
  time?: Temporal.PlainTime,
): Promise<RouteDetails | undefined> {
  const neededInfo = await loadCalendarAgency(repo, routeId, date);
  if (!neededInfo) return undefined;
  const { allCalendars, route, agency, timeZone } = neededInfo;

  const { directionDetails, routeStops } = await findBestTrips(
    repo,
    routeId,
    allCalendars,
    neededInfo.serviceDate.toPlainDateTime(time ?? neededInfo.now),
  );

  const { stops, routes } = await routeStopDetails(repo, routeStops, routeId);
  const bounds = routeBounds(stops);
  routes.set(routeId, route);

  const formatOptions: FormatOptions = {
    serviceDate: neededInfo.serviceDate,
    timeZone,
    stops,
    routes,
    routeId,
  };

  return {
    route,
    agency,
    descParts: extractLinks(route.route_desc),
    stops: new Map(Array.from(routeStops, (id) => [id, route.route_color])),
    bounds: bounds?.toJSON(),
    directions: directionDetails.map((dirDetails) => {
      const closestTripDetails = formatTripDetails(
        dirDetails.closestTrip.trip,
        allCalendars,
        formatOptions,
      );

      return {
        firstStop: dirDetails.firstStop,
        firstStopName: stops.get(dirDetails.firstStop)!.stop_name,
        lastStop: dirDetails.lastStop,
        lastStopName: stops.get(dirDetails.lastStop)!.stop_name,
        earliest: zonedTime(dirDetails.earliest, formatOptions),
        latest: zonedTime(dirDetails.latest, formatOptions),
        allTrips: dirDetails.allTrips,
        closestTrip: {
          ...closestTripDetails,
          offset: durationToData(dirDetails.closestTrip.offset),
          stop: dirDetails.closestTrip.stop,
          stopName: stops.get(dirDetails.closestTrip.stop)!.stop_name,
        },
      };
    }),
  };
}
