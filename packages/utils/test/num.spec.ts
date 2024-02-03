import { test, expect } from 'vitest';
import { toInt } from '../src/num.js';

test('toInt', () => {
  expect(toInt(10)).toBe(10);
  expect(toInt('10')).toBe(10);
});
