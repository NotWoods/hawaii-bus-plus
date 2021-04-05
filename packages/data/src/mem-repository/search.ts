export function searchArray<T>(
  obj: { [id: string]: T },
  max: number,
  cb: (item: T) => boolean,
) {
  const result: T[] = [];
  for (const item of Object.values(obj)) {
    if (cb(item)) {
      result.push(item);
      if (result.length >= max) break;
    }
  }
  return result;
}
