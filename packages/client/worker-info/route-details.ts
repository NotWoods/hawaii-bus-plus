import { Repository } from '@hawaii-bus-plus/data';
import { durationToData, StopTimeData } from '@hawaii-bus-plus/presentation';
import { Agency, Route, Stop } from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';
import { DirectionDetails, findBestTrips, zonedTime } from './trip-details';

export interface RouteDetails {
  readonly route: Route;
  readonly agency: Agency;
  readonly descParts: {
    type: 'text' | 'link';
    value: string;
  }[];
  readonly stops: ReadonlySet<Stop['stop_id']>;

  readonly directions: DirectionDetails[];
}

const LINK_REGEX = /(https?:)\s?(\/\/[.a-z\/]+)/g;

function nowInZone(timeZone: string | Temporal.TimeZoneProtocol) {
  const now = Temporal.now.zonedDateTimeISO();
  return now.withTimeZone(timeZone).toPlainDateTime();
}

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

/**
 * Find the best trip based on the current time of day,
 * along with other route details.
 * @param trips All trips for a route.
 */
export async function getRouteDetails(
  repo: Pick<
    Repository,
    | 'loadRoute'
    | 'loadAgency'
    | 'loadTripsForRoute'
    | 'loadCalendars'
    | 'loadStops'
  >,
  route_id: Route['route_id'],
  now?: Temporal.PlainDateTime
): Promise<RouteDetails | undefined> {
  const allCalendarsReady = repo.loadCalendars();
  const route = await repo.loadRoute(route_id);
  if (!route) {
    return undefined;
  }

  const agency = await repo.loadAgency(route.agency_id);
  const timeZone = agency!.agency_timezone;

  const nowZoned = now || nowInZone(timeZone);
  const nowTime = nowZoned.toPlainTime();
  const nowDate = nowZoned.toPlainDate();

  const allCalendars = await allCalendarsReady;
  const { directionDetails, routeStops } = await findBestTrips(
    repo,
    route_id,
    allCalendars,
    nowZoned
  );

  const stops = await repo.loadStops(
    new Set(
      directionDetails.flatMap((dirDetails) =>
        [dirDetails.firstStop, dirDetails.lastStop].concat(
          dirDetails.closestTrip.trip.stop_times.map((st) => st.stop_id)
        )
      )
    )
  );

  return {
    route,
    agency: agency!,
    descParts: extractLinks(route.route_desc),
    stops: routeStops,
    directions: directionDetails.map((dirDetails) => {
      const stopTimes: StopTimeData[] = dirDetails.closestTrip.trip.stop_times.map(
        (st) => ({
          stop: stops.get(st.stop_id)!,
          arrivalTime: zonedTime(st.arrival_time, nowDate, timeZone),
          departureTime: zonedTime(st.departure_time, nowDate, timeZone),
          timepoint: st.timepoint,
        })
      );

      return {
        firstStop: dirDetails.firstStop,
        firstStopName: stops.get(dirDetails.firstStop)!.stop_name,
        lastStop: dirDetails.lastStop,
        lastStopName: stops.get(dirDetails.lastStop)!.stop_name,
        earliest: zonedTime(dirDetails.earliest, nowDate, timeZone),
        latest: zonedTime(dirDetails.latest, nowDate, timeZone),
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
