import { Stop, StopTime, TimeString, Trip } from '@hawaii-bus-plus/types';
import { PlainDaysTime } from '@hawaii-bus-plus/utils';
import { Temporal } from 'proposal-temporal';
import { traversePath } from './directions';
import { Path } from './directions/raptor';

const LAKELAND = 'll' as Stop['stop_id'];
const LAKELAND_ACROSS = 'll-across' as Stop['stop_id'];
const WAIMEA_PARK = 'wp' as Stop['stop_id'];
const WAIMEA_PARK_ACROSS = 'wp-across' as Stop['stop_id'];
const HWY_INTERSECTON = 'hw' as Stop['stop_id'];
const PARKER_RANCH = 'pr' as Stop['stop_id'];

const NOON = PlainDaysTime.from('12:00:00' as TimeString);

test.concurrent('traversePath', async () => {
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
