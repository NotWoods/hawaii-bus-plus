import test from 'ava';
import { getWords } from '../src/words.js';

test('getWords', (t) => {
  t.deepEqual(getWords('301', 'Intra-Hilo Waikea-Uka'), [
    '301',
    'intra-hilo',
    'intra',
    'hilo',
    'waikea-uka',
    'waikea',
    'uka',
  ]);
  t.deepEqual(getWords('301', 'Waimea Shuttle'), ['301', 'waimea', 'shuttle']);
});
