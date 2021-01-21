import test from 'ava';
import { removeWords } from '../src/format.js';

test('removeWords', (t) => {
  t.deepEqual(removeWords({ words: ['hi'] }), {});
  t.deepEqual(removeWords({ foo: 'bar', words: ['hi'] }), { foo: 'bar' });
});
