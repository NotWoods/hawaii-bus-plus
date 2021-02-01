import { Temporal } from 'proposal-temporal';
import { Opaque } from 'type-fest';
import { TimeString } from '@hawaii-bus-plus/types';
import { toInt } from './num.js';

const HOURS_IN_DAY = 24;

export type PlainDaysTimeSeconds = Opaque<number, 'pdt-seconds'>;

/**
 * Plain time with extra days as needed (i.e.: 25 hours)
 */
export class PlainDaysTime {
  readonly day: number;

  constructor(
    isoDay = 0,
    private readonly time: Temporal.PlainTime = new Temporal.PlainTime()
  ) {
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

  toPlainTime() {
    return this.time;
  }

  toString() {
    const hours = this.day * HOURS_IN_DAY + this.hour;
    return [hours, this.minute, this.second]
      .map((part) => part.toString().padStart(2, '0'))
      .join(':') as TimeString;
  }

  add(
    duration: Omit<Temporal.DurationLike, 'years' | 'months' | 'weeks'>,
    options?: Temporal.ArithmeticOptions
  ) {
    if (this.day === Infinity) return this;

    const { days = 0, ...rest } = duration;
    const time =
      Object.keys(rest).length > 0 ? this.time.add(rest, options) : this.time;
    return new PlainDaysTime(this.day + days, time);
  }

  until(other: PlainDaysTime) {
    let duration = this.time.until(other.time);
    if (this.day !== other.day) {
      duration = duration.add({ days: other.day - this.day });
    }
    return duration;
  }

  /**
   * Convert seconds value to PlainDaysTime.
   */
  static from(value: TimeString | PlainDaysTime) {
    if (typeof value !== 'string') {
      return value as PlainDaysTime;
    }

    let [hours, min, second] = value.split(':').map((s) => toInt(s));
    let days = 0;
    if (hours >= HOURS_IN_DAY) {
      days = Math.floor(hours / HOURS_IN_DAY);
      hours = hours % HOURS_IN_DAY;
    }

    return new PlainDaysTime(days, new Temporal.PlainTime(hours, min, second));
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

export const InfinityPlainDaysTime = new PlainDaysTime(Infinity);

/**
 * Turns a date into a string with hours, minutes.
 * @param  {Date} 	date Date to convert
 * @param  {string} date 24hr string in format 12:00:00 to convert to string in 12hr format
 * @return {string}    	String representation of time
 */
export function stringTime(date: PlainDaysTime | TimeString): string {
  if (typeof date === 'string') {
    if (date.indexOf(':') > -1 && date.lastIndexOf(':') > date.indexOf(':')) {
      date = PlainDaysTime.from(date);
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
