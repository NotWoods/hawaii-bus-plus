import test from 'ava';
import { MultiMap } from '../src/multi-map.js';

test('should be possible to set keys.', (t) => {
  const map = new MultiMap();

  map.set('one', 'hello');
  map.set('one', 'world');

  t.is(map.size, 2);
  t.is(map.dimension, 1);
});

test('should be possible to test the existence of a key in the map.', (t) => {
  const map = new MultiMap();

  map.set('one', 'hello');
  map.set('one', 'world');

  t.is(map.has('one'), true);
  t.is(map.has('two'), false);
});

test('should be possible to clear the map.', (t) => {
  const map = new MultiMap();

  map.set('one', 'hello');
  map.set('one', 'world');

  map.clear();

  t.is(map.size, 0);
  t.is(map.dimension, 0);
  t.is(map.has('one'), false);
});

test('should be possible to get items in the map.', (t) => {
  const map = new MultiMap();

  map.set('one', 'hello');
  map.set('one', 'world');

  t.deepEqual(map.get('one'), ['hello', 'world']);
});
