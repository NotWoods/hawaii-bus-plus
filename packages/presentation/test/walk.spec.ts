import { test, expect } from 'vitest';
import { formatWalkingTime } from '../src/walk.js';

test('formatWalkingTime', () => {
  expect(
    formatWalkingTime({
      time: { minutes: 1, string: 'PT1M' },
      distance: 1,
    }),
  ).toBe('Walk 1 minute');

  expect(
    formatWalkingTime({
      time: { minutes: 1, string: 'PT1M' },
      distance: 1000,
    }),
  ).toBe('Walk 1,000 m');

  expect(
    formatWalkingTime({
      time: { minutes: 0, string: 'PT0M' },
      waitUntil: { minutes: 1, string: 'PT1M' },
      distance: 1,
    }),
  ).toBe('Wait for 1 minute');

  expect(
    formatWalkingTime({
      time: { minutes: 0, string: 'PT0M' },
      distance: 1,
    }),
  ).toBe('');
});
