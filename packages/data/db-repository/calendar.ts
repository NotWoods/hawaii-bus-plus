import { IDBPDatabase } from 'idb';
import { GTFSSchema } from '../database';

export async function loadCalendars(db: IDBPDatabase<GTFSSchema>) {
  const data = await db.getAll('calendar');
  return new Map(data.map((cal) => [cal.service_id, cal]));
}
