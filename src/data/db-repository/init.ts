import { IDBPDatabase } from 'idb';
import { GTFSData } from '../../shared/gtfs-types';
import { getWords, GTFSSchema, SearchRoute, SearchStop } from '../database';
import { downloadScheduleData } from '../fetch';

export async function init(db: IDBPDatabase<GTFSSchema>) {
  return downloadScheduleData().then((api) => initDatabase(db, api));
}

async function initDatabase(db: IDBPDatabase<GTFSSchema>, api: GTFSData) {
  const tx = db.transaction(['routes', 'stops', 'calendar'], 'readwrite');
  const jobs: Promise<unknown>[] = [];

  const routeStore = tx.objectStore('routes');
  for (const r of Object.values(api.routes)) {
    const route = r as SearchRoute;
    route.words = getWords(route.route_short_name, route.route_long_name);
    jobs.push(routeStore.put(route));
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
