import { NodeRepository } from '@hawaii-bus-plus/data/node';
import { expect, test } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { generateDirectionsData } from './generate-data';

test.concurrent('generateDirectionsData', async () => {
  const repo = new NodeRepository();
  const MONDAY = Temporal.PlainDate.from({ year: 2021, month: 1, day: 25 });

  const data = await generateDirectionsData(repo, MONDAY);
  expect(data).toEqual({
    routes: expect.any(Object),
    stops: expect.any(Object),
  });
  const WAIMEA_WESTBOUND =
    'll,hh-kamamalu,hh-hiiaka,hh-hale,hh-kuhio,pr,wp,sc,ji,kv,kvo';
  expect(data.stops['ll']).toEqual({
    id: 'll',
    routes: [
      {
        route_id: WAIMEA_WESTBOUND,
        sequence: 0,
      },
    ],
  });
  expect(data.routes[WAIMEA_WESTBOUND]).toEqual({
    id: WAIMEA_WESTBOUND,
    trips: expect.any(Array),
    stops: expect.any(Set),
  });
  expect(Array.from(data.routes[WAIMEA_WESTBOUND].stops)).toEqual([
    'll',
    'hh-kamamalu',
    'hh-hiiaka',
    'hh-hale',
    'hh-kuhio',
    'pr',
    'wp',
    'sc',
    'ji',
    'kv',
    'kvo',
  ]);
});
