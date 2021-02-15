import { NodeRepository } from '@hawaii-bus-plus/data/node';
import {
  InfinityPlainDaysTime,
  PlainDaysTime,
} from '@hawaii-bus-plus/temporal-utils';
import { Stop, TimeString } from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';
import { generateDirectionsData } from './generate-data';
import { getEarliestValidTrip } from './trip-times';

const MONDAY = Temporal.PlainDate.from({ year: 2021, month: 1, day: 25 });
const WAIMEA_WESTBOUND =
  'll,hh-kamamalu,hh-hiiaka,hh-hale,hh-kuhio,pr,wp,sc,ji,kv,kvo';

test.concurrent('getEarliestValidTrip with infinity', async () => {
  const repo = new NodeRepository();
  const data = await generateDirectionsData(repo, MONDAY);

  const trip = getEarliestValidTrip(
    data.routes[WAIMEA_WESTBOUND],
    'll' as Stop['stop_id'],
    InfinityPlainDaysTime
  );
  expect(trip).toBeUndefined();
});

test.concurrent('getEarliestValidTrip with early time', async () => {
  const repo = new NodeRepository();
  const data = await generateDirectionsData(repo, MONDAY);

  const trip = getEarliestValidTrip(
    data.routes[WAIMEA_WESTBOUND],
    'll' as Stop['stop_id'],
    PlainDaysTime.from('00:00:00' as TimeString)
  );
  expect(trip).toMatchObject({
    trip_short_name: '6:30AM WAIMEA AM',
  });
});

test.concurrent('getEarliestValidTrip with mid time', async () => {
  const repo = new NodeRepository();
  const data = await generateDirectionsData(repo, MONDAY);

  const trip = getEarliestValidTrip(
    data.routes[WAIMEA_WESTBOUND],
    'll' as Stop['stop_id'],
    PlainDaysTime.from('12:00:00' as TimeString)
  );
  expect(trip).toMatchObject({
    trip_short_name: '12:30PM WAIMEA PM',
  });
});
