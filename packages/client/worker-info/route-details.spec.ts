import { NodeRepository } from '@hawaii-bus-plus/data/node';
import { expectPlainTimeData } from '@hawaii-bus-plus/jest-utils';
import { Route } from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';
import { extractLinks, getRouteDetails } from './route-details';

test('extractLinks separates link', () => {
  const routeDesc =
    'For more information go to the Park website at; https: //www.nps.gov/havo/planyourvisit/fees.htm';
  const links = extractLinks(routeDesc);

  expect(links[0].type).toBe('text');
  expect(links[1].type).toBe('link');

  expect(links[1].value).toBe(
    'https://www.nps.gov/havo/planyourvisit/fees.htm'
  );
});

test.concurrent('getRouteDetails when in service', async () => {
  const repo = new NodeRepository();
  const routeId = 'waimea' as Route['route_id'];
  const MONDAY = Temporal.PlainDate.from({ year: 2021, month: 1, day: 25 });
  const now = MONDAY.toPlainDateTime({ hour: 9 });

  const details = await getRouteDetails(repo, routeId, now);
  expect(details).toEqual({
    route: expect.objectContaining({ route_id: 'waimea' }),
    agency: expect.objectContaining({ agency_timezone: 'Pacific/Honolulu' }),
    descParts: expect.arrayContaining([
      expect.objectContaining({ type: 'text' }),
    ]),
    stops: expect.any(Map),
    bounds: {
      east: -155.59700946408782,
      north: 20.042747082274264,
      south: 20.01667313294159,
      west: -155.72108057991983,
    },
    directions: expect.any(Array),
  });
  expect(Array.from(details!.stops.keys())).toEqual([
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
    'ji-across',
    'sc-across',
    'wp-across',
    'll-across',
  ]);
  expect(details!.directions[0]).toBeDefined();
  expect(details!.directions[1]).toBeDefined();

  expect(details!.directions[0]).toEqual({
    firstStop: 'll',
    firstStopName: 'Lakeland',
    lastStop: 'kvo',
    lastStopName: 'Ohina Street',
    earliest: expectPlainTimeData('06:30:00'),
    latest: expectPlainTimeData('17:00:00'),
    allTrips: expect.any(Map),
    closestTrip: expect.objectContaining({
      offset: { days: 0, hours: 0, minutes: 0, seconds: 0, string: 'PT0S' },
      stop: 'kv',
      stopName: 'Kamuela View Estates',
      trip: expect.objectContaining({
        trip_id: expect.stringContaining('waimea-waimea-am'),
        trip_short_name: '8:30AM WAIMEA AM',
      }),
    }),
  });
  expect(details!.directions[1]).toEqual({
    firstStop: 'kv',
    firstStopName: 'Kamuela View Estates',
    lastStop: 'll-across',
    lastStopName: 'Lakeland',
    earliest: expectPlainTimeData('07:00:00'),
    latest: expectPlainTimeData('17:30:00'),
    allTrips: expect.any(Map),
    closestTrip: expect.objectContaining({
      offset: { days: 0, hours: 0, minutes: 0, seconds: 0, string: 'PT0S' },
      stop: 'kv',
      stopName: 'Kamuela View Estates',
      trip: expect.objectContaining({
        trip_id: expect.stringContaining('waimea-waimea-am'),
        trip_short_name: '9:00AM WAIMEA AM',
      }),
    }),
  });
});
