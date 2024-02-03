import { test, expect } from 'vitest';
import { MultiMap } from '../src/multi-map.js';

test('should be possible to set keys.', () => {
  const map = new MultiMap();

  map.set('one', 'hello');
  map.set('one', 'world');

  expect(map.size).toBe(2);
  expect(map.dimension).toBe(1);
});

test('should be possible to test the existence of a key in the map.', () => {
  const map = new MultiMap();

  map.set('one', 'hello');
  map.set('one', 'world');

  expect(map.has('one')).toBe(true);
  expect(map.has('two')).toBe(false);
});

test('should be possible to clear the map.', () => {
  const map = new MultiMap();

  map.set('one', 'hello');
  map.set('one', 'world');

  map.clear();

  expect(map.size).toBe(0);
  expect(map.dimension).toBe(0);
  expect(map.has('one')).toBe(false);
});

test('should be possible to get items in the map.', () => {
  const map = new MultiMap();

  map.set('one', 'hello');
  map.set('one', 'world');

  expect(map.get('one')).toEqual(['hello', 'world']);
});
