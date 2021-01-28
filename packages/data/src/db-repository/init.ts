import { GTFSData } from '@hawaii-bus-plus/types';
import { IDBPDatabase } from 'idb';
import { GTFSSchema, SearchRoute, SearchStop, SearchTrip } from '../database';
import { downloadScheduleData } from '../fetch';
import { getWords } from '../words';

export async function init(db: IDBPDatabase<GTFSSchema>) {
  return downloadScheduleData().then((api) => initDatabase(db, api));
}

async function initDatabase(db: IDBPDatabase<GTFSSchema>, api: GTFSData) {
  const tx = db.transaction(
    ['routes', 'stops', 'trips', 'calendar', 'agency'],
    'readwrite'
  );
  const jobs: Promise<unknown>[] = [];

  const routeStore = tx.objectStore('routes');
  for (const r of Object.values(api.routes)) {
    const route = r as SearchRoute;
    route.words = getWords(route.route_short_name, route.route_long_name);
    jobs.push(routeStore.put(route));
  }

  const tripStore = tx.objectStore('trips');
  for (const t of api.trips) {
    const trip = t as SearchTrip;
    trip.start = t.stop_times[0].departure_time;
    jobs.push(tripStore.put(trip));
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

  const agencyStore = tx.objectStore('agency');
  for (const agency of Object.values(api.agency)) {
    jobs.push(agencyStore.put(agency));
  }

  await Promise.all(jobs);
}
