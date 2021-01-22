import { NodeRepository } from '@hawaii-bus-plus/data/node';
import { Stop } from '@hawaii-bus-plus/types';
import { footPathsLoader } from './footpaths';

const WAIMEA_PARK = 'wp' as Stop['stop_id'];
const HAWAIIAN_STYLE_CAFE = 'sc' as Stop['stop_id'];

test('footPathsLoader', async () => {
  const repo = new NodeRepository();
  const spy = jest.spyOn(repo, 'loadStops');
  const getFootPaths = footPathsLoader(repo);

  const paths1 = await getFootPaths([WAIMEA_PARK]);
  expect(paths1.size).toBe(1);
  expect(paths1.get(WAIMEA_PARK)).toEqual([
    { from_stop_id: WAIMEA_PARK, to_stop_id: 'wp-across', transfer_type: 0 },
  ]);
  expect(spy).toHaveBeenCalledTimes(1);

  const paths2 = await getFootPaths([HAWAIIAN_STYLE_CAFE]);
  expect(paths2.size).toBe(2);
  expect(paths2.get(WAIMEA_PARK)).toEqual([
    { from_stop_id: WAIMEA_PARK, to_stop_id: 'wp-across', transfer_type: 0 },
  ]);
  expect(paths2.get(HAWAIIAN_STYLE_CAFE)).toEqual([
    {
      from_stop_id: HAWAIIAN_STYLE_CAFE,
      to_stop_id: 'sc-across',
      transfer_type: 0,
    },
  ]);
  expect(spy).toHaveBeenCalledTimes(2);

  const paths3 = await getFootPaths([HAWAIIAN_STYLE_CAFE]);
  expect(paths3.size).toBe(2);
  expect(paths3.get(WAIMEA_PARK)).toBeDefined();
  expect(paths3.get(HAWAIIAN_STYLE_CAFE)).toBeDefined();
  expect(spy).toHaveBeenCalledTimes(2);
});
