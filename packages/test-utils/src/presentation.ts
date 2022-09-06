import { expect } from 'vitest';

export function expectPlainTimeData(iso?: string) {
  return {
    epochMilliseconds: expect.any(Number),
    string: iso ?? expect.stringMatching(/\d\d:\d\d:\d\d/),
  };
}

export function expectDurationData(iso?: string) {
  return {
    days: expect.any(Number),
    hours: expect.any(Number),
    minutes: expect.any(Number),
    seconds: expect.any(Number),
    string: iso ?? expect.stringMatching(/^P/),
  };
}
