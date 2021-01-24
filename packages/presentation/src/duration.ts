import { pick } from '@hawaii-bus-plus/utils';
import type { Temporal } from 'proposal-temporal';

const units = ['days', 'hours', 'minutes', 'seconds'] as const;
const formatter = new Intl.RelativeTimeFormat([], { numeric: 'auto' });

/**
 * Balanced duration into
 */
export type DurationData = Partial<Record<typeof units[number], number>>;

export function durationToData(duration: Temporal.Duration): DurationData {
  const time = duration.round({ largestUnit: 'days', smallestUnit: 'seconds' });
  return pick(time, units);
}

export function biggestUnit(duration: DurationData) {
  return units.find((unit) => duration[unit]! > 0);
}

/**
 * Format the duration data as a human readable string.
 * If all duration fields are 0, then undefined is returned.
 */
export function formatDuration(duration: DurationData) {
  const unit = biggestUnit(duration);
  if (unit) {
    return formatter.format(duration[unit]!, unit);
  } else {
    return undefined;
  }
}
