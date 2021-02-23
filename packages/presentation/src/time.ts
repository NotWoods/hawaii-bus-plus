import { memoize } from '@hawaii-bus-plus/utils';
import type { PlainDaysTime } from '@hawaii-bus-plus/temporal-utils';
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
  const dateTime = daysTime.toPlainDateTime(serviceDate);
  const zoned = dateTime.toZonedDateTime(timeZone);

  return {
    epochMilliseconds: zoned.epochMilliseconds,
    string: daysTime.toString(),
  };
}

declare global {
  namespace Intl {
    interface DateTimeFormat {
      formatRange(startDate: Date | number, endDate: Date | number): string;
      formatRangeToParts(
        startDate: Date | number,
        endDate: Date | number
      ): DateTimeFormatRangePart[];
    }

    interface DateTimeFormatOptions {
      timeStyle?: string;
    }

    interface DateTimeFormatRangePart extends DateTimeFormatPart {
      source: 'shared' | 'startRange' | 'endRange';
    }
  }
}

const localTimeFormatter = new Intl.DateTimeFormat([], { timeStyle: 'long' });

const agencyTimeFormatter = memoize(
  (agencyTimezone: string) =>
    new Intl.DateTimeFormat([], {
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
    agencyTime: agencyTimeFormatter(agencyTimezone).format(date),
  };
}

export function formatPlainTimeRange(
  startTime: PlainTimeData,
  endTime: PlainTimeData,
  agencyTimezone: string
) {
  const start = new Date(startTime.epochMilliseconds);
  const end = new Date(endTime.epochMilliseconds);

  return {
    localTime: localTimeFormatter.formatRange(start, end),
    agencyTime: agencyTimeFormatter(agencyTimezone).formatRange(start, end),
  };
}
