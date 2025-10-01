import type { TimeString } from '@hawaii-bus-plus/types';
import { expect, test } from 'vitest';
import { PlainDaysTime } from '../src/plain-days-time.ts';

test('PlainDaysTime defaults to 0', () => {
  const daysTime = new PlainDaysTime();
  const time = daysTime.toPlainTime();
  expect(daysTime.day).toBe(0);
  expect(time.hour).toBe(0);
  expect(time.minute).toBe(0);
  expect(time.second).toBe(0);
  expect(daysTime.toString()).toBe('00:00:00');
});

test('PlainDaysTime returns new object when adding', () => {
  const daysTime = new PlainDaysTime();
  const nextDay = daysTime.add({ days: 2 });
  expect(daysTime.day).toBe(0);
  expect(nextDay.day).toBe(2);
  expect(daysTime.toPlainTime().hour).toBe(0);
  expect(nextDay.toPlainTime().hour).toBe(0);
  expect(daysTime.toString()).toBe('00:00:00');
  expect(nextDay.toString()).toBe('48:00:00');
});

test('PlainDaysTime measures days and time until', () => {
  const first = PlainDaysTime.from('01:00:00' as TimeString);
  const second = PlainDaysTime.from('26:00:00' as TimeString);
  const duration = first.until(second);
  expect(duration.toString()).toBe('P1DT1H');
});
