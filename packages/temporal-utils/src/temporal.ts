import { Temporal } from 'proposal-temporal';

/**
 * Returns the current time, but in the given time zone.
 */
export function nowWithZone(timeZone: string | Temporal.TimeZoneProtocol) {
  const now = Temporal.now.zonedDateTimeISO();
  return now.withTimeZone(timeZone).toPlainDateTime();
}
