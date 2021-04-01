import { getSingle, Repository } from '@hawaii-bus-plus/data';
import { nowWithZone } from '@hawaii-bus-plus/temporal-utils';
import type { Agency, Calendar, Route, Stop } from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';

interface CalendarAgencyResult {
  allCalendars: ReadonlyMap<Calendar['service_id'], Calendar>;
  now: Temporal.PlainTime;
  serviceDate: Temporal.PlainDate;
  route: Route;
  agency: Agency;
  timeZone: string;
}

/**
 * Shared data used for loading route and trip details.
 * @param date Date to load service for. Defaults to today's date.
 */
export async function loadCalendarAgency(
  repo: Pick<Repository, 'loadRoutes' | 'loadAgencies' | 'loadCalendars'>,
  routeId: Route['route_id'],
  date?: Temporal.PlainDate
): Promise<CalendarAgencyResult | undefined> {
  const allCalendarsReady = repo.loadCalendars();

  const route = await getSingle(repo, repo.loadRoutes, routeId);
  if (!route) return undefined;

  const agency = await getSingle(repo, repo.loadAgencies, route.agency_id);
  const timeZone = agency!.agency_timezone;

  const nowZoned = nowWithZone(timeZone);

  return {
    allCalendars: await allCalendarsReady,
    route,
    agency: agency!,
    timeZone,
    serviceDate: date ?? nowZoned.toPlainDate(),
    now: nowZoned.toPlainTime(),
  };
}

interface RouteStopDetails {
  stops: ReadonlyMap<Stop['stop_id'], Stop>;
  routes: Map<Route['route_id'], Route>;
}

export async function routeStopDetails(
  repo: Pick<Repository, 'loadRoutes' | 'loadStops'>,
  routeStops: Iterable<Stop['stop_id']>,
  loadedRoute: Route['route_id']
): Promise<RouteStopDetails> {
  const stops: ReadonlyMap<Stop['stop_id'], Stop> = await repo.loadStops(
    routeStops
  );

  const routeIds = new Set(
    Array.from(stops.values()).flatMap((stop) => stop.routes)
  );
  routeIds.delete(loadedRoute);
  const routes = await repo.loadRoutes(routeIds);

  return { stops, routes };
}
