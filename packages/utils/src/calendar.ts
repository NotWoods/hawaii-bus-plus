import { Calendar, DateString } from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';

/**
 * Check if the given calendar is running on date.
 */
export function calendarRunsOn(calendar: Calendar, date: Temporal.PlainDate) {
  // Does the day of week match a valid day
  const runsOnDayOfWeek = calendar.days[date.dayOfWeek];
  const dateStr = date.toString() as DateString;

  if (runsOnDayOfWeek) {
    return !calendar.removed_dates.includes(dateStr);
  } else {
    return calendar.added_dates.includes(dateStr);
  }
}

export function serviceRunningOn(
  allCalendars: Map<Calendar['service_id'], Calendar>,
  serviceId: Calendar['service_id'],
  date: Temporal.PlainDate
) {
  const calendar = allCalendars.get(serviceId);
  if (!calendar) return false;

  return calendarRunsOn(calendar, date);
}

export function nextServiceDay(
  calendar: Calendar,
  startingFrom: Temporal.PlainDate
) {
  let date = startingFrom;
  let addedDays = 0;
  while (!calendarRunsOn(calendar, date)) {
    date = date.add({ days: 1 });
    addedDays++;
  }
  return { date, addedDays };
}
