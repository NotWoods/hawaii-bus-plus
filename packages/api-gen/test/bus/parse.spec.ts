import JSZip from 'jszip';
import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import { zipFilesToObject } from '../../src/bus/parse.ts';
import type { JsonStreams } from '../../src/bus/parsers.ts';

async function getRoutesFileFromZip(fixtureName: string) {
  const buffer = await readFile(
    new URL(`../fixtures/${fixtureName}`, import.meta.url),
  );
  const zip = await JSZip.loadAsync(buffer);
  return new Map([['routes', zip.file('routes.txt')!]] as const);
}

test('zipFilesToObject big-island-buses.zip', async () => {
  const input = await getRoutesFileFromZip('big-island-buses.zip');
  const result = (await zipFilesToObject(input)) as JsonStreams;

  expect(Object.keys(result)).toEqual(['routes']);

  const expectedKeys = [
    'route_id',
    'route_short_name',
    'route_long_name',
    'route_desc',
    'route_type',
    'route_url',
    'route_color',
    'route_text_color',
    'route_sort_order',
    'direction_0',
    'direction_1',
  ];
  for await (const route of result.routes) {
    expect(Array.isArray(route)).toBe(false);
    expect(Object.keys(route)).toEqual(expectedKeys);
  }
});

test('zipFilesToObject hele-on.zip', async () => {
  const input = await getRoutesFileFromZip('hele-on.zip');
  const result = (await zipFilesToObject(input)) as JsonStreams;

  expect(Object.keys(result)).toEqual(['routes']);

  const expectedKeys = [
    'route_id',
    'agency_id',
    'route_short_name',
    'route_long_name',
    'route_desc',
    'route_type',
    'route_url',
    'route_color',
    'route_text_color',
    'route_sort_order',
    'continuous_pickup',
    'continuous_drop_off',
  ];
  for await (const route of result.routes) {
    expect(Array.isArray(route)).toBe(false);
    expect(Object.keys(route)).toEqual(expectedKeys);
  }
});
