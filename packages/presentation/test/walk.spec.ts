import test from 'ava';
import { formatWalkingTime } from '../src/walk.js';

test('formatWalkingTime', (t) => {
  t.is(
    formatWalkingTime({
      time: { minutes: 1, string: 'PT1M' },
      distance: 1,
    }),
    'Walk 1 minute',
  );

  t.is(
    formatWalkingTime({
      time: { minutes: 1, string: 'PT1M' },
      distance: 1000,
    }),
    'Walk 1,000 m',
  );

  t.is(
    formatWalkingTime({
      time: { minutes: 0, string: 'PT0M' },
      waitUntil: { minutes: 1, string: 'PT1M' },
      distance: 1,
    }),
    'Wait for 1 minute',
  );

  t.is(
    formatWalkingTime({
      time: { minutes: 0, string: 'PT0M' },
      distance: 1,
    }),
    '',
  );
});
