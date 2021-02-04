import { TimeString } from '@hawaii-bus-plus/types';
import { Temporal } from 'proposal-temporal';
import { toInt } from './num.js';

const HOURS_IN_DAY = 24;

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

  toPlainTime() {
    return this.time;
  }

  toPlainDateTime(date: Temporal.PlainDate | Temporal.DateLike | string) {
    return this.toPlainTime().toPlainDateTime(date).add({ days: this.day });
  }

  toString(): TimeString {
    const hours = this.day * HOURS_IN_DAY + this.time.hour;
    return [hours, this.time.minute, this.time.second]
      .map((part) => part.toString().padStart(2, '0'))
      .join(':') as TimeString;
  }

  toJSON(): string {
    return this.toString();
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

    let [hours, min, second] = value.split(':').map(toInt);
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
