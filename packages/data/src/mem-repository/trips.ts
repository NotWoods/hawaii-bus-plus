import type { Trip } from '@hawaii-bus-plus/types';
import type { TripCursor } from '../repository.js';

export function memTripCursor(trips: readonly Trip[]): TripCursor {
  const iter = trips[Symbol.iterator]();
  let result = iter.next();
  return {
    get value() {
      return result.value as Trip;
    },
    continue() {
      result = iter.next();
      return Promise.resolve(result.done ? null : this);
    },
  };
}
