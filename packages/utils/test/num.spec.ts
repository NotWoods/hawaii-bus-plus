import { test, expect } from 'vitest';
import { toInt } from '../src/num.ts';

test('toInt', () => {
  expect(toInt(10)).toBe(10);
  expect(toInt('10')).toBe(10);
});
