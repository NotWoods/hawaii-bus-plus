import { Calendar } from '@hawaii-bus-plus/types';
import { IDBPDatabase } from 'idb';
import { GTFSSchema } from '../database';

export async function loadCalendars(
  db: IDBPDatabase<GTFSSchema>,
): Promise<Map<Calendar['service_id'], Calendar>> {
  const data = await db.getAll('calendar');
  return new Map(data.map((cal) => [cal.service_id, cal]));
}
