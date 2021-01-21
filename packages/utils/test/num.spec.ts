import test from 'ava';
import { toInt } from '../src/num.js';

test('toInt', (t) => {
  t.is(toInt(10), 10);
  t.is(toInt('10'), 10);
});
