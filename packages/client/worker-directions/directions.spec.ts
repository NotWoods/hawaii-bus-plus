import { NodeRepository } from '@hawaii-bus-plus/data/node';
import {
  expectDurationData,
  expectPlainTimeData,
} from '@hawaii-bus-plus/jest-utils';
import { Point } from '@hawaii-bus-plus/presentation';
import { PlainDaysTime } from '@hawaii-bus-plus/temporal-utils';
import { Stop, StopTime, TimeString, Trip } from '@hawaii-bus-plus/types';
import { last } from '@hawaii-bus-plus/utils';
import { expect, test } from '@jest/globals';
import { Temporal } from 'proposal-temporal';
import { directions, traversePath } from './directions';
import { JourneyTripSegment } from './format';
import { Path } from './paths/raptor';

const LAKELAND = 'll' as Stop['stop_id'];
const LAKELAND_ACROSS = 'll-across' as Stop['stop_id'];
const WAIMEA_PARK = 'wp' as Stop['stop_id'];
const WAIMEA_PARK_ACROSS = 'wp-across' as Stop['stop_id'];
const HWY_INTERSECTON = 'hw' as Stop['stop_id'];
const PARKER_RANCH = 'pr' as Stop['stop_id'];
const ST_JOSEPH = 'st' as Stop['stop_id'];
const DA_STORE = 'kahakai-da-store' as Stop['stop_id'];

const NOON = PlainDaysTime.from('12:00:00' as TimeString);

test('traversePath', () => {
  const paths = new Map<Stop['stop_id'], Path>()
    .set(LAKELAND, [{ time: NOON }])
    .set(LAKELAND_ACROSS, [{ time: NOON, transferFrom: LAKELAND }])
    .set(WAIMEA_PARK, [
      undefined,
      {
        time: NOON.add({ minutes: 47 }),
        transferFrom: LAKELAND,
        trip: 'waimea-waimea-pm-0-0' as Trip['trip_id'],
        stopTime: {
          arrival_time: '12:47:00',
          departure_time: '12:47:00',
          stop_id: WAIMEA_PARK,
          stop_sequence: 6,
        } as StopTime,
      },
    ])
    .set(WAIMEA_PARK_ACROSS, [
      undefined,
      {
        time: NOON.add({ minutes: 47 }),
        transferFrom: WAIMEA_PARK,
        transferTo: WAIMEA_PARK_ACROSS,
        transferTime: Temporal.Duration.from({ minutes: 0 }),
      },
    ])
    .set(PARKER_RANCH, [
      undefined,
      {
        time: NOON.add({ minutes: 45 }),
        transferFrom: LAKELAND,
        trip: 'waimea-waimea-pm-0-0' as Trip['trip_id'],
        stopTime: {
          arrival_time: '12:45:00',
          departure_time: '12:45:00',
          stop_id: PARKER_RANCH,
          stop_sequence: 5,
        } as StopTime,
      },
    ])
    .set(HWY_INTERSECTON, [
      undefined,
      undefined,
      {
        time: NOON.add({ hours: 3, minutes: 45 }),
        transferFrom: PARKER_RANCH,
        trip: 'kohala-kona-0645am-nkohala-waim-kona-1' as Trip['trip_id'],
        stopTime: {
          arrival_time: '15:45:00',
          departure_time: '15:45:00',
          stop_id: HWY_INTERSECTON,
          stop_sequence: 12,
          timepoint: true,
        } as StopTime,
      },
    ]);
  const completePath = traversePath(paths, { stop_id: HWY_INTERSECTON });

  expect(completePath).toEqual([
    { time: expect.any(PlainDaysTime) },
    {
      time: expect.any(PlainDaysTime),
      transferFrom: LAKELAND,
      trip: 'waimea-waimea-pm-0-0',
      stopTime: {
        arrival_time: '12:45:00',
        departure_time: '12:45:00',
        stop_id: PARKER_RANCH,
        stop_sequence: 5,
      },
    },
    {
      time: expect.any(PlainDaysTime),
      transferFrom: PARKER_RANCH,
      trip: 'kohala-kona-0645am-nkohala-waim-kona-1',
      stopTime: {
        arrival_time: '15:45:00',
        departure_time: '15:45:00',
        stop_id: HWY_INTERSECTON,
        stop_sequence: 12,
        timepoint: true,
      },
    },
  ]);
  expect(completePath!.map((p) => p.time.toString())).toEqual([
    '12:00:00',
    '12:45:00',
    '15:45:00',
  ]);
});

test.concurrent('directions', async () => {
  const repo = new NodeRepository();
  const from: Point = {
    name: 'Pomaikai Housing / St Joseph',
    stopId: ST_JOSEPH,
    type: 'stop',
  };
  const to: Point = {
    name: 'Kahakai Boulevard & Da Store',
    stopId: DA_STORE,
    type: 'stop',
  };
  const departTime =
    Temporal.PlainDate.from('2021-02-04').toPlainDateTime('10:10:00');

  const { journeys } = await directions(repo, from, to, departTime);
  expect(journeys).toHaveLength(1);
  expect(journeys[0]).toEqual({
    depart: undefined,
    arrive: undefined,
    departTime: expectPlainTimeData('14:45:00'),
    arriveTime: expectPlainTimeData('15:45:00'),
    stops: expect.any(Map),
    trips: expect.any(Array),
    duration: expectDurationData('PT1H'),
    fare: expect.stringContaining('$2.00'),
    bounds: expect.any(Object),
  });
  expect(journeys[0].trips).toHaveLength(1);

  const segment = journeys[0].trips[0] as JourneyTripSegment;
  expect(segment).toEqual({
    trip: expect.objectContaining({ trip_id: 'hilo-pahala-pahoa-4-1' }),
    route: expect.objectContaining({ route_id: 'hilo-pahala' }),
    agency: expect.objectContaining({ agency_id: 'HOB' }),
    stopTimes: expect.any(Array),
  });
  expect(segment.stopTimes).toHaveLength(10);
  expect(segment.stopTimes[0].stop).toMatchObject({ stop_id: ST_JOSEPH });
  expect(last(segment.stopTimes).stop).toMatchObject({
    stop_id: DA_STORE,
  });
});
