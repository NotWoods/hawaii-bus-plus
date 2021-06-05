import { NodeRepository } from '@hawaii-bus-plus/data/node';
import { Stop } from '@hawaii-bus-plus/types';
import { expect, jest, test } from '@jest/globals';
import { stopsLoader } from './footpaths';

const WAIMEA_PARK = 'wp' as Stop['stop_id'];
const HAWAIIAN_STYLE_CAFE = 'sc' as Stop['stop_id'];

test.concurrent('stopsLoader', async () => {
  const repo = new NodeRepository();
  const spy = jest.spyOn(repo, 'loadStops');
  const loadStops = stopsLoader(repo);

  const paths1 = await loadStops([WAIMEA_PARK]);
  expect(paths1.size).toBe(1);
  expect(paths1.get(WAIMEA_PARK)!.transfers).toEqual([
    { from_stop_id: WAIMEA_PARK, to_stop_id: 'wp-across', transfer_type: 0 },
  ]);
  expect(spy).toHaveBeenCalledTimes(1);

  const paths2 = await loadStops([HAWAIIAN_STYLE_CAFE]);
  expect(paths2.size).toBe(1);
  expect(paths2.get(HAWAIIAN_STYLE_CAFE)!.transfers).toEqual([
    {
      from_stop_id: HAWAIIAN_STYLE_CAFE,
      to_stop_id: 'sc-across',
      transfer_type: 0,
    },
  ]);
  expect(spy).toHaveBeenCalledTimes(2);

  const paths3 = await loadStops([HAWAIIAN_STYLE_CAFE]);
  expect(Array.from(paths3.keys())).toEqual([HAWAIIAN_STYLE_CAFE]);
  expect(paths3.get(HAWAIIAN_STYLE_CAFE)).toBeDefined();
  expect(spy).toHaveBeenCalledTimes(2);
});
