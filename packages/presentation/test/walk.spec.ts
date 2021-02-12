import test from 'ava';
import { formatWalkingTime } from '../src/walk.js';

test('formatWalkingTime', (t) => {
  t.is(
    formatWalkingTime({
      time: { minutes: 1, string: 'PT1M' },
      distance: 1,
    }),
    'Walk in 1 minute'
  );

  t.is(
    formatWalkingTime({
      time: { minutes: 1, string: 'PT1M' },
      distance: 1000,
    }),
    'Walk 1,000 m'
  );
});
