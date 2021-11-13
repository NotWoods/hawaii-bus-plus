import { NodeRepository } from '@hawaii-bus-plus/data/node';
import { expect, test } from '@jest/globals';
import { findClosestStops } from './closest-stops.js';

const WAIMEA = { lat: 20.022818482273284, lng: -155.67176568698534 };
const VANCOUVER = { lat: 49.0878967367812, lng: -123.01349642409956 };

test.concurrent('findClosestStops to waimea', async () => {
  const repo = new NodeRepository();
  const stops = await findClosestStops(repo, WAIMEA);

  expect(stops).toHaveLength(5);
  expect(stops[0]).toMatchObject({
    stop_id: 'wp-across',
    stop_name: 'Waimea Park',
  });
  expect(stops[1]).toMatchObject({
    stop_id: 'wp',
    stop_name: 'Waimea Park',
  });
  expect(stops[2]).toMatchObject({
    stop_id: 'pc',
    stop_name: 'Waimea - Parker Square',
  });
  expect(stops[3]).toMatchObject({
    stop_id: 'sc',
    stop_name: 'Hawaiian Style Café',
  });
  expect(stops[4]).toMatchObject({
    stop_id: 'sc-across',
    stop_name: 'Hawaiian Style Café',
  });

  expect(stops[0]).toHaveProperty('distance');
});

test.concurrent(
  'findClosestStops returns no results outside Hawaii',
  async () => {
    const repo = new NodeRepository();
    const stops = await findClosestStops(repo, VANCOUVER);

    expect(stops).toHaveLength(0);
  },
);
