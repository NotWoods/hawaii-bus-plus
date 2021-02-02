import { Trip } from '@hawaii-bus-plus/types';
import { TripCursor } from '../repository';

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
