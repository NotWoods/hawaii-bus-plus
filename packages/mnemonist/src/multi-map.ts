/**
 * Implementation of a MultiMap.
 */
export class MultiMap<K, V> implements ReadonlyMap<K, readonly V[]> {
  private readonly items = new Map<K, V[]>();
  dimension!: number;
  size!: number;

  constructor() {
    this.clear();
    Object.defineProperty(this.items, 'constructor', {
      value: MultiMap,
      enumerable: false,
    });
  }

  /**
   * Method used to clear the structure.
   */
  clear(): void {
    this.size = 0;
    this.dimension = 0;
    this.items.clear();
  }

  /**
   * Method used to set a value.
   */
  set(key: K, value: V): this {
    let container = this.items.get(key);

    if (!container) {
      this.dimension++;
      container = [];
      this.items.set(key, container);
    }

    container.push(value);
    this.size++;

    return this;
  }

  /**
   * Method used to return whether the given keys exists in the map.
   *
   * @param  {any}     key - Key to check.
   * @return {boolean}
   */
  has(key: K): boolean {
    return this.items.has(key);
  }

  /**
   * Method used to return the container stored at the given key or `undefined`.
   *
   * @param  {any}     key - Key to get.
   * @return {boolean}
   */
  get(key: K): readonly V[] | undefined {
    return this.items.get(key);
  }

  toJSON() {
    return this.items;
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }

  keys() {
    return this.items.keys();
  }

  values() {
    return this.items.values();
  }

  entries() {
    return this.items.entries();
  }

  forEach(
    callback: (
      values: readonly V[],
      key: K,
      map: ReadonlyMap<K, readonly V[]>,
    ) => void,
    thisArg?: unknown,
  ) {
    this.items.forEach(callback, thisArg);
  }
}
