import { memoize } from '@hawaii-bus-plus/utils';
import { DurationData, formatDuration } from './duration.js';

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
    }),
);

export function formatWalkingTime(walk: Walking) {
  let walkTime: string | undefined;
  if (walk.distance >= 1_000) {
    // TODO feet
    walkTime = distanceFormatter('meter', []).format(walk.distance);
  } else {
    walkTime = formatDuration(walk.time, 'long');
  }
  if (walk.waitUntil) {
    const until = formatDuration(walk.waitUntil, 'long')!;
    if (walkTime) {
      let result = `Walk ${walkTime}`;
      if (until) {
        result += `, then wait for ${until}`;
      }
      return result;
    } else if (until) {
      return `Wait for ${until}`;
    } else {
      return '';
    }
  }

  if (walkTime) {
    return `Walk ${walkTime}`;
  } else {
    return '';
  }
}
