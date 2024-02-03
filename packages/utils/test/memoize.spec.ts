import { test, expect } from 'vitest';
import { memoize } from '../src/memoize.js';

test('memoize should call func again if args change', () => {
  let calls = 0;
  function increase(_: string) {
    calls++;
    return calls;
  }
  const memoized = memoize(increase);

  expect(calls).toBe(0);
  expect(memoized('foo')).toBe(1);
  expect(memoized('foo')).toBe(1);
  expect(memoized('bar')).toBe(2);
});
