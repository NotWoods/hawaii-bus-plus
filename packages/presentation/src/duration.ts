import { pick, memoize } from '@hawaii-bus-plus/utils';
import type { Temporal } from 'proposal-temporal';

const units = ['days', 'hours', 'minutes', 'seconds'] as const;
const relativeFormatter = new Intl.RelativeTimeFormat([], { numeric: 'auto' });
const numberFormatter = memoize(
  (unit: string, unitDisplay: UnitDisplay) =>
    new Intl.NumberFormat([], {
      style: 'unit',
      unit,
      unitDisplay,
    }),
);

type UnitDisplay = 'long' | 'short' | 'narrow';
type Unit = typeof units[number];
type NotPlural<Unit extends string> = Unit extends `${infer Single}s`
  ? Single
  : never;

function notPlural(unit: Unit): NotPlural<Unit> {
  return unit.slice(0, -1) as NotPlural<Unit>;
}

/**
 * Balanced duration into
 */
export interface DurationData
  extends Partial<Record<typeof units[number], number>> {
  string: string;
}

export function durationToData(duration: Temporal.Duration): DurationData {
  const time = duration.round({ largestUnit: 'days', smallestUnit: 'seconds' });
  const data = pick(time, units) as DurationData;
  data.string = time.toString();
  return data;
}

export function biggestUnit(duration: DurationData) {
  return units.find((unit) => duration[unit]! > 0);
}

export function formatDurationParts(
  duration: DurationData,
  unitDisplay: 'long' | 'short' | 'narrow',
) {
  const unit = biggestUnit(duration);
  if (unit) {
    const single = notPlural(unit);
    const formatter = numberFormatter(single, unitDisplay);
    return formatter.formatToParts(duration[unit]);
  } else {
    return [];
  }
}

export function formatDuration(
  duration: DurationData,
  unitDisplay: 'long' | 'short' | 'narrow',
) {
  const unit = biggestUnit(duration);
  if (unit) {
    const single = notPlural(unit);
    const formatter = numberFormatter(single, unitDisplay);
    return formatter.format(duration[unit]!);
  } else {
    return undefined;
  }
}

/**
 * Format the duration data as a human readable string.
 * If all duration fields are 0, then undefined is returned.
 */
export function formatRelativeDuration(duration: DurationData) {
  const unit = biggestUnit(duration);
  if (unit) {
    return relativeFormatter.format(duration[unit]!, unit);
  } else {
    return undefined;
  }
}
