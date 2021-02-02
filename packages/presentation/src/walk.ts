import { memoize } from '@hawaii-bus-plus/utils';
import { biggestUnit, DurationData, formatDuration } from './duration.js';

export interface Walking {
  /** How long it takes to walk to a location */
  time: DurationData;
  /** How long to wait before a bus arrives at the location */
  waitUntil?: DurationData;
  /** Walking distance in meters */
  distance: number;
}

const distanceFormatter = memoize(
  (unit: 'meter' | 'foot', locales: string[]) =>
    new Intl.NumberFormat(locales, {
      style: 'unit',
      unit,
    })
);

export function formatWalkingTime(walk: Walking) {
  let walkTime;
  if (walk.distance >= 1_000) {
    // TODO feet
    walkTime = distanceFormatter('meter', []).format(walk.distance);
  } else {
    walkTime = formatDuration(walk.time)!;
  }
  if (walk.waitUntil) {
    const unit = biggestUnit(walk.waitUntil);
    if (unit === 'days' || unit === 'hours' || walk.waitUntil.minutes! > 4) {
      const until = formatDuration(walk.waitUntil)!;
      return `Walk ${walkTime}, then wait for ${until}`;
    }
  }
  return `Walk ${walkTime}`;
}
