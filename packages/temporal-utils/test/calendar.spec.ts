import { test, expect } from 'vitest';
import type { Calendar, DateString } from '@hawaii-bus-plus/types';
import { Temporal } from '@js-temporal/polyfill';
import { calendarRunsOn } from '../src/calendar.js';

const baseCalendar = {
  service_id: '' as Calendar['service_id'],
  service_name: '',
  added_dates: [],
  removed_dates: [],
  start_date: '2020-12-31' as DateString,
  end_date: '2021-12-31' as DateString,
};

test('calendarRunsOn false for holiday', () => {
  const monToFri: Calendar = {
    ...baseCalendar,
    days: [true, true, true, true, true, false, false],
  };
  const withHoliday: Calendar = {
    ...monToFri,
    removed_dates: ['2021-01-01' as DateString],
  };
  const newYearsFriday = Temporal.PlainDate.from({
    year: 2021,
    month: 1,
    day: 1,
  });

  expect(calendarRunsOn(monToFri, newYearsFriday)).toBe(true);
  expect(calendarRunsOn(withHoliday, newYearsFriday)).toBe(false);
});
