/**
 * Mnemonist Set
 * ==============
 *
 * Useful function related to sets such as union, intersection and so on...
 */

/**
 * Variadic function computing the intersection of multiple sets.
 *
 * @param  {...Set} sets - Sets to intersect.
 * @return {Set}         - The intesection.
 */
export function intersection<T>(...args: ReadonlySet<T>[]): Set<T> {
  if (args.length < 2)
    throw new Error(
      'mnemonist/Set.intersection: needs at least two arguments.'
    );

  const I = new Set<T>();

  // First we need to find the smallest set
  let smallestSize = Infinity;
  let smallestSet: ReadonlySet<T> | undefined;

  for (const set of args) {
    // If one of the set has no items, we can stop right there
    if (set.size === 0) return I;

    if (set.size < smallestSize) {
      smallestSize = set.size;
      smallestSet = set;
    }
  }

  // Now we need to intersect this set with the others
  for (const item of smallestSet!.values()) {
    let add = true;

    for (const set of args) {
      if (set === smallestSet) continue;

      if (!set.has(item)) {
        add = false;
        break;
      }
    }

    if (add) I.add(item);
  }

  return I;
}

/**
 * Variadic function computing the union of multiple sets.
 *
 * @param  {...Set} sets - Sets to unite.
 * @return {Set}         - The union.
 */
export function union<T>(...args: ReadonlySet<T>[]): Set<T> {
  const U = new Set<T>();

  for (const set of args) {
    for (const value of set.values()) {
      U.add(value);
    }
  }

  return U;
}

/**
 * Function computing the difference between two sets.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {Set}   - The difference.
 */
export function difference<T>(A: ReadonlySet<T>, B: ReadonlySet<T>): Set<T> {
  // If first set is empty
  if (!A.size) return new Set<T>();

  if (!B.size) return new Set<T>(A);

  const D = new Set<T>();

  for (const value of A) {
    if (!B.has(value)) {
      D.add(value);
    }
  }

  return D;
}

/**
 * Function computing the symmetric difference between two sets.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {Set}   - The symmetric difference.
 */
export function symmetricDifference<T>(
  A: ReadonlySet<T>,
  B: ReadonlySet<T>
): Set<T> {
  const S = new Set<T>();

  for (const value of A) {
    if (!B.has(value)) {
      S.add(value);
    }
  }

  for (const value of B) {
    if (!A.has(value)) {
      S.add(value);
    }
  }

  return S;
}

/**
 * Function returning whether A is a subset of B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {boolean}
 */
export function isSubset<T>(A: ReadonlySet<T>, B: ReadonlySet<T>): boolean {
  // Shortcuts
  if (A === B) return true;
  if (A.size > B.size) return false;

  for (const value of A) {
    if (!B.has(value)) {
      return false;
    }
  }

  return true;
}

/**
 * Function returning whether A is a superset of B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {boolean}
 */
export function isSuperset<T>(A: ReadonlySet<T>, B: ReadonlySet<T>): boolean {
  return isSubset(B, A);
}

/**
 * Function adding the items of set B to the set A.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 */
export function add<T>(A: Set<T>, B: Iterable<T>): void {
  for (const value of B) {
    A.add(value);
  }
}

/**
 * Function subtracting the items of set B from the set A.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 */
export function subtract<T>(A: Set<T>, B: Iterable<T>): void {
  for (const value of B) {
    A.delete(value);
  }
}

/**
 * Function intersecting the items of A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 */
export function intersect<T>(A: Set<T>, B: ReadonlySet<T>): void {
  for (const value of A) {
    if (!B.has(value)) {
      A.delete(value);
    }
  }
}

/**
 * Function disjuncting the items of A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 */
export function disjunct<T>(A: Set<T>, B: ReadonlySet<T>): void {
  const toRemove = [];

  for (const value of A) {
    if (B.has(value)) {
      toRemove.push(value);
    }
  }

  for (const value of B) {
    if (!A.has(value)) {
      A.add(value);
    }
  }

  for (const item of toRemove) {
    A.delete(item);
  }
}

/**
 * Function returning the size of the intersection of A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {number}
 */
export function intersectionSize<T>(
  A: ReadonlySet<T>,
  B: ReadonlySet<T>
): number {
  // We need to know the smallest set
  if (A.size > B.size) {
    const tmp = A;
    A = B;
    B = tmp;
  }

  if (A.size === 0) return 0;
  if (A === B) return A.size;

  let I = 0;

  for (const value of A) {
    if (B.has(value)) {
      I++;
    }
  }

  return I;
}

/**
 * Function returning the size of the union of A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {number}
 */
export function unionSize<T>(A: ReadonlySet<T>, B: ReadonlySet<T>): number {
  const I = intersectionSize(A, B);

  return A.size + B.size - I;
}

/**
 * Function returning the Jaccard similarity between A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {number}
 */
export function jaccard<T>(A: ReadonlySet<T>, B: ReadonlySet<T>): number {
  const I = intersectionSize(A, B);

  if (I === 0) return 0;

  const U = A.size + B.size - I;

  return I / U;
}

/**
 * Function returning the overlap coefficient between A & B.
 *
 * @param  {Set} A - First set.
 * @param  {Set} B - Second set.
 * @return {number}
 */
export function overlap<T>(A: ReadonlySet<T>, B: ReadonlySet<T>): number {
  const I = intersectionSize(A, B);

  if (I === 0) return 0;

  return I / Math.min(A.size, B.size);
}
