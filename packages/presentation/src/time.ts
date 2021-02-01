import { memoize, PlainDaysTime } from '@hawaii-bus-plus/utils';
import type { Temporal } from 'proposal-temporal';

export interface PlainTimeData {
  /** Milliseconds since epoch, used to build Date object. */
  epochMilliseconds: number;
  /** ISO string usable in <time datetime=""> attribute. */
  string: string;
}

export function plainTimeToData(
  daysTime: PlainDaysTime,
  serviceDate: Temporal.PlainDate,
  timeZone: string | Temporal.TimeZoneProtocol
): PlainTimeData {
  const dateTime = daysTime
    .toPlainTime()
    .toPlainDateTime(serviceDate)
    .add({ days: daysTime.day });
  const zoned = dateTime.toZonedDateTime(timeZone);

  return {
    epochMilliseconds: zoned.epochMilliseconds,
    string: daysTime.toString(),
  };
}

declare global {
  namespace Intl {
    interface DateTimeFormatOptions {
      timeStyle?: string;
    }
  }
}

const localTimeFormatter = new Intl.DateTimeFormat([], { timeStyle: 'long' });

const agencyTimeFormatter = memoize(
  (agencyTimezone: string, locale: string[]) =>
    new Intl.DateTimeFormat(locale, {
      timeStyle: 'short',
      timeZone: agencyTimezone,
    })
);

/**
 * Format the plain time data as a human readable string.
 */
export function formatPlainTime(
  plainTime: PlainTimeData,
  agencyTimezone: string
) {
  const date = new Date(plainTime.epochMilliseconds);

  return {
    localTime: localTimeFormatter.format(date),
    agencyTime: agencyTimeFormatter(agencyTimezone, []).format(date),
  };
}
