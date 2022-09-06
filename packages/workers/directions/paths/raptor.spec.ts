import { NodeRepository } from '@hawaii-bus-plus/data/node';
import { PlainDaysTime } from '@hawaii-bus-plus/temporal-utils';
import { Stop, TimeString } from '@hawaii-bus-plus/types';
import { expect, test } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { raptorDirections } from './raptor';

const LAKELAND = 'll' as Stop['stop_id'];
const LAKELAND_ACROSS = 'll-across' as Stop['stop_id'];
const WAIMEA_PARK = 'wp' as Stop['stop_id'];
const WAIMEA_PARK_ACROSS = 'wp-across' as Stop['stop_id'];
const HWY_INTERSECTON = 'hw' as Stop['stop_id'];
const PARKER_RANCH = 'pr' as Stop['stop_id'];

const NOON = PlainDaysTime.from('12:00:00' as TimeString);
const MONDAY = Temporal.PlainDate.from({ year: 2021, month: 1, day: 25 });

test.concurrent('raptor', async () => {
  const repo = new NodeRepository();
  const directions = await raptorDirections(
    repo,
    [{ stop_id: LAKELAND, departure_time: NOON }],
    MONDAY,
  );

  expect(directions.size).not.toBe(0);
  expect(directions.get(LAKELAND)).toEqual([
    { time: expect.any(PlainDaysTime) },
  ]);
  expect(directions.get(LAKELAND)![0]!.time.toString()).toBe('12:00:00');

  expect(directions.get(WAIMEA_PARK)).toEqual([
    undefined,
    {
      time: expect.any(PlainDaysTime),
      transferFrom: LAKELAND,
      trip: 'waimea-waimea-pm-0-0',
      stopTime: expect.objectContaining({
        arrival_time: '12:47:00',
        departure_time: '12:47:00',
        stop_id: WAIMEA_PARK,
        stop_sequence: 6,
      }),
    },
  ]);
  expect(directions.get(WAIMEA_PARK)![1]!.time.toString()).toBe('12:47:00');
  expect(directions.get(WAIMEA_PARK_ACROSS)).toEqual([
    undefined,
    {
      time: expect.any(PlainDaysTime),
      transferFrom: WAIMEA_PARK,
      transferTo: WAIMEA_PARK_ACROSS,
      transferTime: expect.any(Temporal.Duration),
    },
  ]);
  expect(directions.get(WAIMEA_PARK_ACROSS)![1]!.time.toString()).toBe(
    '12:47:00',
  );

  expect(directions.get(LAKELAND_ACROSS)).toEqual([
    {
      time: expect.any(PlainDaysTime),
      transferFrom: LAKELAND,
      transferTo: LAKELAND_ACROSS,
      transferTime: expect.any(Temporal.Duration),
    },
  ]);
  expect(directions.get(LAKELAND_ACROSS)![0]!.time.toString()).toBe('12:00:00');

  expect(directions.get(PARKER_RANCH)).toEqual([
    undefined,
    {
      time: expect.any(PlainDaysTime),
      transferFrom: LAKELAND,
      trip: 'waimea-waimea-pm-0-0',
      stopTime: expect.objectContaining({
        arrival_time: '12:45:00',
        departure_time: '12:45:00',
        stop_id: PARKER_RANCH,
        stop_sequence: 5,
      }),
    },
  ]);
  expect(directions.get(PARKER_RANCH)![1]!.time.toString()).toBe('12:45:00');
  expect(directions.get(HWY_INTERSECTON)).toEqual([
    undefined,
    undefined,
    {
      time: expect.any(PlainDaysTime),
      transferFrom: PARKER_RANCH,
      trip: 'kohala-kona-0645am-nkohala-waim-kona-1',
      stopTime: expect.objectContaining({
        arrival_time: '15:45:00',
        departure_time: '15:45:00',
        stop_id: HWY_INTERSECTON,
        stop_sequence: 12,
      }),
    },
  ]);
  expect(directions.get(HWY_INTERSECTON)![2]!.time.toString()).toBe('15:45:00');
});

test.concurrent('raptor weekend', async () => {
  const repo = new NodeRepository();
  const directions = await raptorDirections(
    repo,
    [{ stop_id: LAKELAND, departure_time: NOON }],
    MONDAY.subtract({ days: 1 }),
  );

  expect(directions.size).not.toBe(0);
  expect(directions.get(LAKELAND)).toEqual([
    { time: expect.any(PlainDaysTime) },
  ]);
  expect(directions.get(LAKELAND)![0]!.time.toString()).toBe('12:00:00');

  expect(directions.get(WAIMEA_PARK)).toBeUndefined();
  expect(directions.get(WAIMEA_PARK_ACROSS)).toBeUndefined();

  expect(directions.get(LAKELAND_ACROSS)).toEqual([
    {
      time: expect.any(PlainDaysTime),
      transferFrom: LAKELAND,
      transferTo: LAKELAND_ACROSS,
      transferTime: expect.any(Temporal.Duration),
    },
  ]);
  expect(directions.get(LAKELAND_ACROSS)![0]!.time.toString()).toBe('12:00:00');

  expect(directions.get(PARKER_RANCH)).toBeUndefined();
  expect(directions.get(HWY_INTERSECTON)).toBeUndefined();
});
