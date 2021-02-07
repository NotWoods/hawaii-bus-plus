export function expectPlainTimeData(iso?: string) {
  return {
    epochMilliseconds: expect.any(Number),
    string: iso ?? expect.stringMatching(/\d\d:\d\d:\d\d/),
  };
}
