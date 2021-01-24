export function pick<T, Keys extends keyof T>(obj: T, keys: readonly Keys[]) {
  const result: Partial<Pick<T, Keys>> = {};
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result as Pick<T, Keys>;
}
