import { IDBPDatabase } from 'idb';
import { DefaultMap } from 'mnemonist';
import { Temporal } from 'proposal-temporal';
import { GTFSSchema } from '../../data/database';
import { DateString } from '../../shared/data-types';
import {
  DirectionRoute,
  DirectionsData,
  DirectionStop,
} from '../../shared/directions-types';
import { Calendar, Stop, Trip } from '../../shared/gtfs-types';
import { uniqueRouteId } from './route-queue';

function runsOn(calendar: Calendar | undefined, date: Temporal.PlainDate) {
  if (!calendar) {
    return false;
  }

  // Does the day of week match a valid day
  const runsOnDayOfWeek = calendar.days[date.dayOfWeek];
  const dateStr = date.toString() as DateString;

  if (runsOnDayOfWeek) {
    return !calendar.removed_dates.includes(dateStr);
  } else {
    return calendar.added_dates.includes(dateStr);
  }
}

export async function generateDirectionsData(
  db: IDBPDatabase<GTFSSchema>,
  date: Temporal.PlainDate
): Promise<DirectionsData> {
  const allCalendars = new Map(
    (await db.getAll('calendar')).map((cal) => [cal.service_id, cal])
  );
  let cursor = await db.transaction('trips').store.index('start').openCursor();

  const trips: Trip[] = [];
  const routes = new DefaultMap<DirectionRoute['id'], DirectionRoute>((id) => ({
    id,
    trips: [],
    stops: new Set(),
  }));
  const stops = new DefaultMap<Stop['stop_id'], DirectionStop>((id) => ({
    id,
    routes: [],
  }));

  while (cursor) {
    const trip = cursor.value;
    const calendar = allCalendars.get(trip.service_id);
    if (runsOn(calendar, date)) {
      trips.push(trip);

      const routeId = uniqueRouteId(trip);
      const route = routes.get(routeId);
      route.trips.push(trip);

      for (const stopTime of trip.stop_times) {
        const stop = stops.get(stopTime.stop_id);
        stop.routes.push({
          route_id: routeId,
          sequence: stopTime.stop_sequence,
        });
        route.stops.add(stop.id);
      }
    }
    cursor = await cursor.continue();
  }

  return {
    routes: Object.fromEntries(routes),
    stops: Object.fromEntries(stops),
  };
}
