import type { Calendar } from '@hawaii-bus-plus/types';
import type { IDBPDatabase } from 'idb';
import type { GTFSSchema } from '../database.ts';

export async function loadCalendars(
  db: IDBPDatabase<GTFSSchema>,
): Promise<Map<Calendar['service_id'], Calendar>> {
  const data = await db.getAll('calendar');
  return new Map(data.map((cal) => [cal.service_id, cal]));
}
