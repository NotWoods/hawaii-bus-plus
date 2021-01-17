import { IDBPObjectStore } from 'idb';

export async function searchWordsIndex<T>(
  objectStore: IDBPObjectStore<any, any, any>,
  searchTerm: string,
  max: number
) {
  const index = objectStore.index('words');
  const term = searchTerm.toLowerCase();
  const keyRange = IDBKeyRange.bound(term, term + '\uffff', false, false);

  const results: T[] = [];
  let cursor = await index.openCursor(keyRange);
  for (let i = 0; i < max && cursor; i++) {
    results.push(cursor.value);
    cursor = await cursor.continue();
  }
  return results;
}
