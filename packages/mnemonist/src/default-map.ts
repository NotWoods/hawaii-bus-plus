/**
 * Mnemonist DefaultMap
 * =====================
 *
 * JavaScript implementation of a default map that will return a constructed
 * value any time one tries to access an inexisting key. It's quite similar
 * to python's defaultdict.
 */
export class DefaultMap<K, V> implements Iterable<[K, V]>, ReadonlyMap<K, V> {
  private readonly items = new Map<K, V>();
  private readonly factory: (key: K, index: number) => V;
  size = 0;

  constructor(factory: (key: K, index: number) => V) {
    this.factory = factory;
  }

  /**
   * Method used to clear the structure.
   */
  clear(): void {
    this.items.clear();
    this.size = 0;
  }

  /**
   * Method used to get the value set for given key. If the key does not exist,
   * the value will be created using the provided factory.
   *
   * @param  {any} key - Target key.
   */
  get(key: K): V {
    let value = this.items.get(key);

    if (typeof value === 'undefined') {
      value = this.factory(key, this.size);
      this.items.set(key, value);
      this.size++;
    }

    return value;
  }

  /**
   * Method used to get the value set for given key. If the key does not exist,
   * a value won't be created.
   *
   * @param  {any} key - Target key.
   * @return {boolean}
   */
  peek(key: K): V | undefined {
    return this.items.get(key);
  }

  /**
   * Method used to set a value for given key.
   *
   * @param  {any} key   - Target key.
   * @param  {any} value - Value.
   * @return {DefaultMap}
   */
  set(key: K, value: V): this {
    this.items.set(key, value);
    this.size = this.items.size;

    return this;
  }

  /**
   * Method used to test the existence of a key in the map.
   *
   * @param  {any} key   - Target key.
   * @return {boolean}
   */
  has(key: K): boolean {
    return this.items.has(key);
  }

  /**
   * Method used to iterate over each of the key/value pairs.
   *
   * @param  {function}  callback - Function to call for each item.
   * @param  {object}    scope    - Optional scope.
   * @return {undefined}
   */
  forEach(
    callback: (value: V, key: K, map: ReadonlyMap<K, V>) => void,
    scope: unknown = this,
  ): void {
    this.items.forEach(callback, scope);
  }

  keys(): IterableIterator<K> {
    return this.items.keys();
  }
  values(): IterableIterator<V> {
    return this.items.values();
  }
  entries(): IterableIterator<[K, V]> {
    return this.items.entries();
  }
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }
}
