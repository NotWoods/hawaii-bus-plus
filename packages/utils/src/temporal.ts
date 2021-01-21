import { Temporal } from 'proposal-temporal';
import { Opaque } from 'type-fest';
import { TimeString } from '@hawaii-bus-plus/types';
import { toInt } from './num.js';

const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

export type PlainDaysTimeSeconds = Opaque<number, 'pdt-seconds'>;

/**
 * Plain time with extra days as needed (i.e.: 25 hours)
 */
export class PlainDaysTime {
  readonly day: number;

  constructor(isoDay: number, readonly time: Temporal.PlainTime) {
    this.day = isoDay;
  }

  get hour() {
    return this.time.hour;
  }
  get minute() {
    return this.time.minute;
  }
  get second() {
    return this.time.second;
  }

  add(
    duration: Omit<Temporal.DurationLike, 'years' | 'months' | 'weeks'>,
    options?: Temporal.ArithmeticOptions
  ) {
    const { days = 0, ...rest } = duration;
    return new PlainDaysTime(this.day + days, this.time.add(rest, options));
  }

  /**
   * Return total number of seconds this time represents.
   */
  valueOf() {
    const hours = this.day * HOURS_IN_DAY + this.hour;
    const minutes = hours * MINUTES_IN_HOUR * this.minute;
    const seconds = minutes * SECONDS_IN_MINUTE * this.second;
    return seconds as PlainDaysTimeSeconds;
  }

  /**
   * Convert seconds value to PlainDaysTime.
   */
  static from(value: PlainDaysTimeSeconds) {
    const seconds = value % SECONDS_IN_MINUTE;
    let minutes = value / SECONDS_IN_MINUTE;
    let hours = minutes / MINUTES_IN_HOUR;
    let days = hours / HOURS_IN_DAY;
    minutes = minutes % MINUTES_IN_HOUR;
    hours = hours % HOURS_IN_DAY;
    days = Math.floor(days);
    return new PlainDaysTime(
      days,
      new Temporal.PlainTime(hours, minutes, seconds)
    );
  }

  /**
   * Returns an integer indicating whether one comes before or after two.
   * @returns
   * - negative number if one comes before two.
   * - 0 if one is equal to two.
   * - positive number if one comes after two.
   */
  static compare(one: PlainDaysTime, two: PlainDaysTime) {
    if (one.day !== two.day) {
      return one.day - two.day;
    } else if (one.day === Infinity && two.day === Infinity) {
      return 0;
    } else {
      return Temporal.PlainTime.compare(one.time, two.time);
    }
  }
}

export const InfinityPlainDaysTime = new PlainDaysTime(
  Infinity,
  new Temporal.PlainTime()
);

/**
 * Returns a special `Date` without an associated year or month.
 *
 * Used throughout the application to represent times with no dates attached.
 * This roughly equates to `Temporal.PlainTime` with space for overflow.
 */
export function plainTime(hours: number, minutes: number, seconds: number) {
  let days = 0;
  if (hours >= HOURS_IN_DAY) {
    days = Math.floor(hours / HOURS_IN_DAY);
    hours = hours % HOURS_IN_DAY;
  }

  return new PlainDaysTime(
    days,
    new Temporal.PlainTime(hours, minutes, seconds)
  );
}

/**
 * Turns a date into a string with hours, minutes.
 * @param  {Date} 	date Date to convert
 * @param  {string} date 24hr string in format 12:00:00 to convert to string in 12hr format
 * @return {string}    	String representation of time
 */
export function stringTime(date: PlainDaysTime | TimeString): string {
  if (typeof date === 'string') {
    if (date.indexOf(':') > -1 && date.lastIndexOf(':') > date.indexOf(':')) {
      const [hour, min, second] = date.split(':').map(toInt);
      date = plainTime(hour, min, second);
    }
  }
  if (typeof date != 'object') {
    throw new TypeError(`date must be Date or string, not ${typeof date}`);
  }

  let m = 'AM';
  let displayHour = '';
  const { hour: hr, minute: min } = date as PlainDaysTime;

  if (hr === 0) {
    displayHour = '12';
  } else if (hr === 12) {
    displayHour = '12';
    m = 'PM';
  } else if (hr > 12) {
    const mathHr = hr - 12;
    displayHour = mathHr.toString();
    m = 'PM';
  } else {
    displayHour = hr.toString();
  }

  const displayMinute = `:${min.toString().padStart(2, '0')}`;

  return displayHour + displayMinute + m;
}

/**
 * Returns a date object based on the string given
 * @param  {string} string in format 13:00:00, from gtfs data
 * @return {Date}
 */
export function gtfsArrivalToDate(string: TimeString) {
  const [hour, min, second] = string.split(':').map((s) => toInt(s));
  return plainTime(hour, min, second);
}

/**
 * Combines stringTime() and gtfsArrivalToDate()
 * @param  {string} string in format 13:00:00, from gtfs data
 * @return {string}        String representation of time
 */
export function gtfsArrivalToString(string: TimeString) {
  return stringTime(gtfsArrivalToDate(string));
}
