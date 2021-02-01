import test from 'ava';
import { readFile } from 'fs/promises';
import JSZip from 'jszip';
import { GTFS_ZIP_LOCATION } from '../src/env.js';
import { zipFilesToObject } from '../src/parse.js';
import { JsonStreams } from '../src/parsers.js';

test('zipFilesToObject', async (t) => {
  const buffer = await readFile(GTFS_ZIP_LOCATION);
  const zip = await JSZip.loadAsync(buffer);
  const input = new Map(
    Object.entries({
      routes: zip.file('routes.txt')!,
    })
  );
  const result = (await zipFilesToObject(input)) as JsonStreams;

  t.deepEqual(Object.keys(result), ['routes']);

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
  ];
  for await (const route of result.routes) {
    t.false(Array.isArray(route));
    t.deepEqual(Object.keys(route), expectedKeys);
  }
});
