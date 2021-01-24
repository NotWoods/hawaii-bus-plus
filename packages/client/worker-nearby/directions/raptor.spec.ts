import { NodeRepository } from '@hawaii-bus-plus/data/node';
import { Stop, TimeString } from '@hawaii-bus-plus/types';
import { PlainDaysTime } from '@hawaii-bus-plus/utils';
import { Temporal } from 'proposal-temporal';
import { raptorDirections } from './raptor';

const LAKELAND = 'll' as Stop['stop_id'];
//const LAKELAND_ACROSS = 'll-across' as Stop['stop_id'];
const WAIMEA_PARK = 'wp' as Stop['stop_id'];
//const WAIMEA_PARK_ACROSS = 'wp-across' as Stop['stop_id'];
const HWY_INTERSECTON = 'hw' as Stop['stop_id'];
const PARKER_RANCH = 'pr' as Stop['stop_id'];

test.concurrent('raptor', async () => {
  const repo = new NodeRepository();
  const directions = await raptorDirections(
    repo,
    [
      {
        stop_id: LAKELAND,
        departure_time: PlainDaysTime.from('12:00:00' as TimeString),
      },
    ],
    Temporal.PlainDate.from({ year: 2021, month: 1, day: 25 })
  );

  expect(directions.size).not.toBe(0);
  expect(directions.get(LAKELAND)).toEqual([
    { time: expect.any(PlainDaysTime) },
  ]);
  expect(directions.get(LAKELAND)![0].time.toString()).toBe('12:00:00');

  expect(directions.get(WAIMEA_PARK)).toEqual([
    undefined,
    {
      time: expect.any(PlainDaysTime),
      transfer_from: LAKELAND,
      trip: 'waimea-waimea-pm-5',
    },
  ]);
  expect(directions.get(WAIMEA_PARK)![1].time.toString()).toBe('12:47:00');
  /*expect(directions.get(WAIMEA_PARK_ACROSS)).toEqual([
    undefined,
    {
      time: expect.any(PlainDaysTime),
      transfer_from: LAKELAND,
      trip: 'waimea-waimea-pm-5',
    },
  ]);
  expect(directions.get(WAIMEA_PARK_ACROSS)![1].time.toString()).toBe(
    '12:47:00'
  );*/

  /*expect(directions.get(LAKELAND_ACROSS)).toEqual([
    undefined,
    { time: expect.any(PlainDaysTime), transfer_from: LAKELAND },
  ]);
  expect(directions.get(LAKELAND_ACROSS)![1].time.toString()).toBe('12:00:00');*/

  expect(directions.get(PARKER_RANCH)).toEqual([
    undefined,
    {
      time: expect.any(PlainDaysTime),
      transfer_from: LAKELAND,
      trip: 'waimea-waimea-pm-5',
    },
  ]);
  expect(directions.get(PARKER_RANCH)![1].time.toString()).toBe('12:45:00');
  expect(directions.get(HWY_INTERSECTON)).toEqual([
    undefined,
    undefined,
    {
      time: expect.any(PlainDaysTime),
      transfer_from: PARKER_RANCH,
      trip: 'kohala-kona-0645am-nkohala-waim-kona-1',
    },
  ]);
  expect(directions.get(HWY_INTERSECTON)![2].time.toString()).toBe('15:45:00');
});
