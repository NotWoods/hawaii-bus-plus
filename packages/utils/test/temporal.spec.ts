import { TimeString } from '@hawaii-bus-plus/types';
import test from 'ava';
import { PlainDaysTime } from '../src/temporal.js';

test('PlainDaysTime defaults to 0', (t) => {
  const daysTime = new PlainDaysTime();
  const time = daysTime.toPlainTime();
  t.is(daysTime.day, 0);
  t.is(time.hour, 0);
  t.is(time.minute, 0);
  t.is(time.second, 0);
  t.is(daysTime.toString(), '00:00:00');
});

test('PlainDaysTime returns new object when adding', (t) => {
  const daysTime = new PlainDaysTime();
  const nextDay = daysTime.add({ days: 2 });
  t.is(daysTime.day, 0);
  t.is(nextDay.day, 2);
  t.is(daysTime.toPlainTime().hour, 0);
  t.is(nextDay.toPlainTime().hour, 0);
  t.is(daysTime.toString(), '00:00:00');
  t.is(nextDay.toString(), '48:00:00');
});

test('PlainDaysTime measures days and time until', (t) => {
  const first = PlainDaysTime.from('01:00:00' as TimeString);
  const second = PlainDaysTime.from('26:00:00' as TimeString);
  const duration = first.until(second);
  t.is(duration.toString(), 'P1DT1H');
});
