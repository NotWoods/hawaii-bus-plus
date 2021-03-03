import test from 'ava';
import { DefaultMap } from '../src/default-map.js';

const FACTORY: () => number[] = () => [];

test('should be possible to set & get keys.', (t) => {
  const map = new DefaultMap(FACTORY);

  map.get('one').push(1);
  map.set('two', [2]);

  t.deepEqual(map.get('one'), [1]);
  t.deepEqual(map.get('two'), [2]);

  t.is(map.size, 2);

  t.deepEqual(map.get('unknown'), []);

  t.is(map.size, 3);

  map.clear();

  t.is(map.size, 0);
  t.deepEqual(map.get('one'), []);
});

test("should be possible to iterate over the map's items.", (t) => {
  const map = new DefaultMap(FACTORY);

  map.get('one').push(1);
  map.get('two').push(2);

  const items = Array.from(map);

  t.deepEqual(items, [
    ['one', [1]],
    ['two', [2]],
  ]);
});

test('should be possible to create iterators.', (t) => {
  const map = new DefaultMap(FACTORY);

  map.get('one').push(1);
  map.get('two').push(2);

  const entries: [string, number[]][] = [
    ['one', [1]],
    ['two', [2]],
  ];

  t.deepEqual(Array.from(map.entries()), entries);
  t.deepEqual(
    Array.from(map.keys()),
    entries.map((e) => {
      return e[0];
    })
  );
  t.deepEqual(
    Array.from(map.values()),
    entries.map((e) => {
      return e[1];
    })
  );
});

test('should be possible to peek.', (t) => {
  const map = new DefaultMap(FACTORY);

  map.get('one').push(1);

  t.deepEqual(map.peek('one'), [1]);
  t.is(map.peek('two'), undefined);
  t.is(map.size, 1);
  t.is(map.has('two'), false);
});
