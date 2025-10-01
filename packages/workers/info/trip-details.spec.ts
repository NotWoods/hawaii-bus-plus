import { NodeFixtureRepository } from '@hawaii-bus-plus/data/fixture';
import type { Route } from '@hawaii-bus-plus/types';
import { test } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { findBestTrips } from './trip-details';

const NEW_YEARS = Temporal.PlainDate.from({ year: 2021, month: 1, day: 1 });
const SUNDAY = Temporal.PlainDate.from({ year: 2021, month: 1, day: 24 });
const MONDAY = Temporal.PlainDate.from({ year: 2021, month: 1, day: 25 });

test.concurrent(
  'findBestTrips before route is running that day',
  async ({ expect }) => {
    const repo = new NodeFixtureRepository();
    const routeId = 'waimea' as Route['route_id'];
    const now = MONDAY.toPlainDateTime({ hour: 5 });
    const allCalendars = await repo.loadCalendars();

    const { directionDetails } = await findBestTrips(
      repo,
      routeId,
      allCalendars,
      now,
    );
    expect(directionDetails).toHaveLength(2);
    expect(directionDetails[0]).toBeDefined();
    expect(directionDetails[1]).toBeDefined();

    expect(directionDetails[0].closestTrip.offset).toMatchObject({
      hours: 1,
      minutes: 30,
      seconds: 0,
    });
    expect(directionDetails[0].closestTrip.trip).toMatchObject({
      trip_id: expect.stringContaining('waimea-waimea-am'),
      trip_short_name: '6:30AM WAIMEA AM',
    });
    expect(directionDetails[1].closestTrip.offset).toMatchObject({
      hours: 2,
      minutes: 0,
      seconds: 0,
    });
    expect(directionDetails[1].closestTrip.trip).toMatchObject({
      trip_id: expect.stringContaining('waimea-waimea-am'),
      trip_short_name: '7:00AM WAIMEA AM',
    });
  },
);

test.concurrent(
  'findBestTrips after route has run that day',
  async ({ expect }) => {
    const repo = new NodeFixtureRepository();
    const routeId = 'waimea' as Route['route_id'];
    const now = MONDAY.toPlainDateTime({ hour: 20 });

    const allCalendars = await repo.loadCalendars();
    const { directionDetails } = await findBestTrips(
      repo,
      routeId,
      allCalendars,
      now,
    );
    expect(directionDetails).toHaveLength(2);
    expect(directionDetails[0]).toBeDefined();
    expect(directionDetails[1]).toBeDefined();

    expect(directionDetails[0].closestTrip.trip).toEqual(
      directionDetails[0].earliestTrip.trip,
    );
    expect(directionDetails[1].closestTrip.trip).toEqual(
      directionDetails[1].earliestTrip.trip,
    );
    expect(directionDetails[0].earliestTrip.trip).toMatchObject({
      trip_id: expect.stringContaining('waimea-waimea-am'),
      trip_short_name: '6:30AM WAIMEA AM',
    });
    expect(directionDetails[1].earliestTrip.trip).toMatchObject({
      trip_id: expect.stringContaining('waimea-waimea-am'),
      trip_short_name: '7:00AM WAIMEA AM',
    });
  },
);

test.concurrent(
  'findBestTrips on a Sunday when the route is not in service',
  async ({ expect }) => {
    const repo = new NodeFixtureRepository();
    const routeId = 'waimea' as Route['route_id'];
    const now = SUNDAY.toPlainDateTime({ hour: 3 });
    const allCalendars = await repo.loadCalendars();
    const { directionDetails } = await findBestTrips(
      repo,
      routeId,
      allCalendars,
      now,
    );

    expect(directionDetails).toHaveLength(2);
    expect(directionDetails[0]).toBeDefined();
    expect(directionDetails[1]).toBeDefined();

    expect(directionDetails[0].closestTrip.offset?.toString()).toBe(
      'P1DT3H30M',
    );
    expect(directionDetails[0].closestTrip.trip?.trip_short_name).toBe(
      '6:30AM WAIMEA AM',
    );
    expect(directionDetails[1].closestTrip.offset?.toString()).toBe('P1DT4H');
    expect(directionDetails[1].closestTrip.trip?.trip_short_name).toBe(
      '7:00AM WAIMEA AM',
    );
  },
);

test.concurrent(
  'findBestTrips on a holiday when the route is not in service',
  async ({ expect }) => {
    const repo = new NodeFixtureRepository();
    const routeId = 'waimea' as Route['route_id'];
    const now = NEW_YEARS.toPlainDateTime({ hour: 6 });
    const allCalendars = await repo.loadCalendars();
    const { directionDetails } = await findBestTrips(
      repo,
      routeId,
      allCalendars,
      now,
    );

    expect(directionDetails).toHaveLength(2);
    expect(directionDetails[0]).toBeDefined();
    expect(directionDetails[1]).toBeDefined();

    expect(directionDetails[0].closestTrip.offset?.toString()).toBe('P1DT30M');
    expect(directionDetails[0].closestTrip.trip?.trip_short_name).toBe(
      '6:30AM WAIMEA AM',
    );
    expect(directionDetails[1].closestTrip.offset?.toString()).toBe('P1DT1H');
    expect(directionDetails[1].closestTrip.trip?.trip_short_name).toBe(
      '7:00AM WAIMEA AM',
    );
  },
);
