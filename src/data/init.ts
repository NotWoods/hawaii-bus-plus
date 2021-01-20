import { Mutable } from 'type-fest';
import { GTFSData, Route, RouteWithTrips } from '../shared/gtfs-types';
import { gtfsArrivalToDate } from '../shared/utils/temporal';
import {
  dbReady,
  getWords,
  SearchRoute,
  SearchStop,
  SearchTrip,
} from './database';

export async function initDatabase(api: GTFSData) {
  const db = await dbReady;

  const tx = db.transaction(
    ['routes', 'stops', 'trips', 'calendar'],
    'readwrite'
  );
  const jobs: Promise<unknown>[] = [];

  const tripStore = tx.objectStore('trips');
  const routeStore = tx.objectStore('routes');
  for (const r of Object.values(api.routes)) {
    for (const t of Object.values(r.trips)) {
      const trip = t as SearchTrip;
      trip.start = gtfsArrivalToDate(t.stop_times[0].departure_time).valueOf();
      jobs.push(tripStore.put(trip));
    }
    const route = r as Route & Partial<Mutable<RouteWithTrips>>;
    delete route.trips;

    const searchRoute = route as SearchRoute;
    searchRoute.words = getWords(route.route_short_name, route.route_long_name);
    jobs.push(routeStore.put(searchRoute));
  }

  const stopStore = tx.objectStore('stops');
  for (const s of Object.values(api.stops)) {
    const stop = s as SearchStop;
    stop.words = getWords(stop.stop_name, stop.stop_desc);
    jobs.push(stopStore.put(stop));
  }

  const calendarStore = tx.objectStore('calendar');
  for (const calendar of Object.values(api.calendar)) {
    jobs.push(calendarStore.put(calendar));
  }

  await Promise.all(jobs);
}
