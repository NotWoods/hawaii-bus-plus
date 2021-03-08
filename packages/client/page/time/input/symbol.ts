import { Temporal } from 'proposal-temporal';

/**
 * Represent the current time without loading a date library.
 */
export type NOW = typeof NOW;
export const NOW = Symbol('now');

export function timeForWorker(
  time:
    | NOW
    | string
    | undefined
    | Temporal.PlainDateTime
    | Temporal.PlainDate
    | Temporal.PlainTime
) {
  if (time === NOW || time == undefined) {
    // Use undefined to represent "now"
    return undefined;
  } else if (typeof time === 'string') {
    return time;
  } else {
    return time.toString();
  }
}
