import { Temporal } from '@js-temporal/polyfill';

/**
 * Returns the current time, but in the given time zone.
 */
export function nowWithZone(timeZone: string | Temporal.TimeZoneProtocol) {
  const now = Temporal.Now.zonedDateTimeISO();
  return now.withTimeZone(timeZone).toPlainDateTime();
}
