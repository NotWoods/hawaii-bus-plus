export interface PlainTimeData {
  /** Milliseconds since epoch, used to build Date object. */
  epochMilliseconds: number;
  /** ISO string usable in <time datetime=""> attribute. */
  string: string;
}

declare global {
  namespace Intl {
    interface DateTimeFormatOptions {
      timeStyle?: string;
    }
  }
}

const localTimeFormatter = new Intl.DateTimeFormat([], { timeStyle: 'long' });

let lastAgencyTimezone: string | undefined;
let agencyTimeFormatter: Intl.DateTimeFormat | undefined;

/**
 * Format the plain time data as a human readable string.
 */
export function formatPlainTime(
  plainTime: PlainTimeData,
  agencyTimezone: string
) {
  const date = new Date(plainTime.epochMilliseconds);

  if (agencyTimezone !== lastAgencyTimezone) {
    lastAgencyTimezone = agencyTimezone;
    agencyTimeFormatter = new Intl.DateTimeFormat([], {
      timeStyle: 'short',
      timeZone: agencyTimezone,
    });
  }

  return {
    localTime: localTimeFormatter.format(date),
    agencyTime: agencyTimeFormatter!.format(date),
  };
}
