import { test, expect } from 'vitest';
import { getWords } from '../src/words.js';

test('getWords', () => {
  expect(getWords('301', 'Intra-Hilo Waikea-Uka')).toEqual([
    '301',
    'intra-hilo',
    'intra',
    'hilo',
    'waikea-uka',
    'waikea',
    'uka',
  ]);
  expect(getWords('301', 'Waimea Shuttle')).toEqual([
    '301',
    'waimea',
    'shuttle',
  ]);
});
