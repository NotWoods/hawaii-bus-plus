import 'map.prototype.getorinsert/auto';

declare global {
  interface Map<K, V> {
    getOrInsert(key: K, defaultValue: V): V
  }
}
