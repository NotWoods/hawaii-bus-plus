import { Stop, TimeString } from '@hawaii-bus-plus/types';
import { PlainDaysTime } from '@hawaii-bus-plus/utils';
import { traversePath } from './directions';

const LAKELAND = 'll' as Stop['stop_id'];
const LAKELAND_ACROSS = 'll-across' as Stop['stop_id'];
const WAIMEA_PARK = 'wp' as Stop['stop_id'];
const WAIMEA_PARK_ACROSS = 'wp-across' as Stop['stop_id'];
const HWY_INTERSECTON = 'hw' as Stop['stop_id'];
const PARKER_RANCH = 'pr' as Stop['stop_id'];

const NOON = PlainDaysTime.from('12:00:00' as TimeString);

test.concurrent('traversePath', async () => {
  const paths = new Map()
    .set(LAKELAND, [{ time: NOON }])
    .set(LAKELAND_ACROSS, [{ time: NOON, transfer_from: LAKELAND }])
    .set(WAIMEA_PARK, [
      undefined,
      {
        time: NOON.add({ minutes: 47 }),
        transfer_from: LAKELAND,
        trip: 'waimea-waimea-pm-0-0',
      },
    ])
    .set(WAIMEA_PARK_ACROSS, [
      undefined,
      {
        time: NOON.add({ minutes: 47 }),
        transfer_from: WAIMEA_PARK,
      },
    ])
    .set(PARKER_RANCH, [
      undefined,
      {
        time: NOON.add({ minutes: 45 }),
        transfer_from: LAKELAND,
        trip: 'waimea-waimea-pm-0-0',
      },
    ])
    .set(HWY_INTERSECTON, [
      undefined,
      undefined,
      {
        time: NOON.add({ hours: 3, minutes: 45 }),
        transfer_from: PARKER_RANCH,
        trip: 'kohala-kona-0645am-nkohala-waim-kona-1',
      },
    ]);
  const journey = traversePath(paths, { stop_id: HWY_INTERSECTON });

  expect(journey).toEqual({
    path: [
      { time: expect.any(PlainDaysTime) },
      {
        time: expect.any(PlainDaysTime),
        transfer_from: LAKELAND,
        trip: 'waimea-waimea-pm-0-0',
      },
      {
        time: expect.any(PlainDaysTime),
        transfer_from: PARKER_RANCH,
        trip: 'kohala-kona-0645am-nkohala-waim-kona-1',
      },
    ],
    lastStop: HWY_INTERSECTON,
  });
  expect(journey.path!.map((p) => p.time.toString())).toEqual([
    '12:00:00',
    '12:45:00',
    '15:45:00',
  ]);
});

test.concurrent('traverseJourney', async () => {
  const paths = new Map()
    .set(LAKELAND, [{ time: NOON }])
    .set(LAKELAND_ACROSS, [{ time: NOON, transfer_from: LAKELAND }])
    .set(WAIMEA_PARK, [
      undefined,
      {
        time: NOON.add({ minutes: 47 }),
        transfer_from: LAKELAND,
        trip: 'waimea-waimea-pm-0-0',
      },
    ])
    .set(WAIMEA_PARK_ACROSS, [
      undefined,
      {
        time: NOON.add({ minutes: 47 }),
        transfer_from: WAIMEA_PARK,
      },
    ])
    .set(PARKER_RANCH, [
      undefined,
      {
        time: NOON.add({ minutes: 45 }),
        transfer_from: LAKELAND,
        trip: 'waimea-waimea-pm-0-0',
      },
    ])
    .set(HWY_INTERSECTON, [
      undefined,
      undefined,
      {
        time: NOON.add({ hours: 3, minutes: 45 }),
        transfer_from: PARKER_RANCH,
        trip: 'kohala-kona-0645am-nkohala-waim-kona-1',
      },
    ]);
  const journey = traversePath(paths, { stop_id: HWY_INTERSECTON });

  expect(journey).toEqual({
    path: [
      { time: expect.any(PlainDaysTime) },
      {
        time: expect.any(PlainDaysTime),
        transfer_from: LAKELAND,
        trip: 'waimea-waimea-pm-0-0',
      },
      {
        time: expect.any(PlainDaysTime),
        transfer_from: PARKER_RANCH,
        trip: 'kohala-kona-0645am-nkohala-waim-kona-1',
      },
    ],
    lastStop: HWY_INTERSECTON,
  });
  expect(journey.path!.map((p) => p.time.toString())).toEqual([
    '12:00:00',
    '12:45:00',
    '15:45:00',
  ]);
});
