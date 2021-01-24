import { Stop, TimeString } from '@hawaii-bus-plus/types';
import { PlainDaysTime } from '@hawaii-bus-plus/utils';
import { traverseJourney } from './directions';

const NOON = PlainDaysTime.from('12:00:00' as TimeString);
const LAKELAND = 'll' as Stop['stop_id'];
const HWY_INTERSECTON = 'hw' as Stop['stop_id'];
const PARKER_RANCH = 'pr' as Stop['stop_id'];

test.concurrent('traverseJourney', async () => {
  const paths = new Map()
    .set(LAKELAND, [{ time: NOON }])
    .set(PARKER_RANCH, [
      undefined,
      { time: NOON, transfer_from: LAKELAND, trip: 'waimea-waimea-pm-5' },
    ])
    .set(HWY_INTERSECTON, [
      undefined,
      undefined,
      {
        time: NOON,
        transfer_from: PARKER_RANCH,
        trip: 'kohala-kona-0645am-nkohala-waim-kona-1',
      },
    ]);
  const journey = traverseJourney(paths, { stop_id: HWY_INTERSECTON });

  expect(journey).toEqual({
    path: [
      { time: NOON },
      { time: NOON, transfer_from: LAKELAND, trip: 'waimea-waimea-pm-5' },
      {
        time: NOON,
        transfer_from: PARKER_RANCH,
        trip: 'kohala-kona-0645am-nkohala-waim-kona-1',
      },
    ],
    lastStop: HWY_INTERSECTON,
  });
});
