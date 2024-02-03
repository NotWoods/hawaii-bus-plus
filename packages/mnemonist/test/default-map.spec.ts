import { test, expect } from 'vitest';
import { DefaultMap } from '../src/default-map.js';

const FACTORY: () => number[] = () => [];

test('should be possible to set & get keys.', () => {
  const map = new DefaultMap(FACTORY);

  map.get('one').push(1);
  map.set('two', [2]);

  expect(map.get('one')).toEqual([1]);
  expect(map.get('two')).toEqual([2]);

  expect(map.size).toBe(2);

  expect(map.get('unknown')).toEqual([]);

  expect(map.size).toBe(3);

  map.clear();

  expect(map.size).toBe(0);
  expect(map.get('one')).toEqual([]);
});

test("should be possible to iterate over the map's items.", () => {
  const map = new DefaultMap(FACTORY);

  map.get('one').push(1);
  map.get('two').push(2);

  const items = Array.from(map);

  expect(items).toEqual([
    ['one', [1]],
    ['two', [2]],
  ]);
});

test('should be possible to create iterators.', () => {
  const map = new DefaultMap(FACTORY);

  map.get('one').push(1);
  map.get('two').push(2);

  const entries: [string, number[]][] = [
    ['one', [1]],
    ['two', [2]],
  ];

  expect(Array.from(map.entries())).toEqual(entries);
  expect(Array.from(map.keys())).toEqual(['one', 'two']);
});
