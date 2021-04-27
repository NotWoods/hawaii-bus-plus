/**
 * Helper for keys in a list without fully unique IDs.
 */
export function useDuplicateKeys() {
  const keySoFar = new Map<string, number>();

  return function makeKey(key: string) {
    const keySuffix = keySoFar.get(key) ?? 0;
    keySoFar.set(key, keySuffix + 1);
    return `${key}${keySuffix}`;
  };
}
