import { parse, type CastingContext } from 'csv-parse';
import JSZip from 'jszip';
import { readFile } from 'node:fs/promises';
import { expect, test } from 'vitest';
import { cast } from '../../src/bus/cast.ts';

async function* loadZipFile(
  fileName: string,
  fixtureName = 'big-island-buses.zip',
) {
  const zipData = await readFile(
    new URL(`../fixtures/${fixtureName}`, import.meta.url),
  );
  const zip = await JSZip.loadAsync(zipData);

  const file = zip.file(fileName);
  if (!file) {
    throw new Error(`${fileName} is missing from zip`);
  }

  const input = file.nodeStream('nodebuffer');
  const parser = parse({
    cast,
    columns: true,
  });
  yield* input.pipe(parser);
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

test('cast float', async () => {
  for await (const row of loadZipFile('stops.txt')) {
    expect(row.stop_id).toBeTypeOf('string');
    expect(row.stop_lat).toBeTypeOf('number');
    expect(row.stop_lon).toBeTypeOf('number');
  }
});

test('cast int', async () => {
  for await (const row of loadZipFile('fare_attributes.txt')) {
    expect(row.fare_id).toBeTypeOf('string');
    expect(row.payment_method).toBeTypeOf('number');
    expect(row.transfers).toBeTypeOf('number');
  }
});

test('cast bool and date', async () => {
  for await (const row of loadZipFile('calendar.txt')) {
    expect(row.service_id).toBeTypeOf('string');
    expect(row.monday).toBeTypeOf('boolean');
    expect(row.tuesday).toBeTypeOf('boolean');
    expect(row.wednesday).toBeTypeOf('boolean');
    expect(row.thursday).toBeTypeOf('boolean');
    expect(row.friday).toBeTypeOf('boolean');
    expect(row.saturday).toBeTypeOf('boolean');
    expect(row.sunday).toBeTypeOf('boolean');

    const startDate = row.start_date as string;
    const date = startDate.split('-');
    expect(date).toHaveLength(3);
    const [, month, day] = date;
    expect(month).toHaveLength(2);
    expect(day).toHaveLength(2);
  }
});

test('cast route long name to format title case', () => {
  const mockContext = (column: string) => ({ column }) as CastingContext;

  expect(cast('HILO / OCEAN VIEW', mockContext('route_long_name'))).toBe(
    'Hilo / Ocean View',
  );
  expect(cast('GREENLINE HONOKAA', mockContext('route_long_name'))).toBe(
    'Green Line: Honokaa',
  );
  expect(cast('Weird formatting', mockContext('route_long_name'))).toBe(
    'Weird formatting',
  );
});
