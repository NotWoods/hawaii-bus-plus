import test from 'ava';
import { memoize } from '../src/memoize.js';

test('memoize should call func again if args change', (t) => {
  let calls = 0;
  function increase(_: string) {
    calls++;
    return calls;
  }
  const memoized = memoize(increase);

  t.is(calls, 0);
  t.is(memoized('foo'), 1);
  t.is(memoized('foo'), 1);
  t.is(memoized('bar'), 2);
});
