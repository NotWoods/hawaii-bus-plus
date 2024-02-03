import { test, expect } from 'vitest';
import { removeWords } from '../src/format.js';

test('removeWords', () => {
  expect(removeWords({ words: ['hi'] })).toEqual({});
  expect(removeWords({ foo: 'bar', words: ['hi'] })).toEqual({ foo: 'bar' });
});
