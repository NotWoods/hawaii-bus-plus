import { test, expect } from 'vitest';
import * as functions from '../src/set.js';

test('should properly compute the intersection of two sets.', () => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const I = functions.intersection(A, B);

  expect(Array.from(I)).toEqual([2, 3]);
});

test('intersection should be variadic.', () => {
  const A = new Set([1, 2, 3, 4]),
    B = new Set([2, 3, 4]),
    C = new Set([1, 4]),
    D = new Set([4, 5, 6]);

  const I = functions.intersection(A, B, C, D);

  expect(Array.from(I)).toEqual([4]);
});

test('should properly compute the union of two sets.', () => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const U = functions.union(A, B);

  expect(Array.from(U)).toEqual([1, 2, 3, 4]);
});

test('union should be variadic.', () => {
  const A = new Set([1, 2, 3, 4]),
    B = new Set([2, 3, 4]),
    C = new Set([1, 4]),
    D = new Set([4, 5, 6]);

  const U = functions.union(A, B, C, D);

  expect(Array.from(U)).toEqual([1, 2, 3, 4, 5, 6]);
});

test('should properly compute the difference of two sets.', () => {
  const A = new Set([1, 2, 3, 4, 5]),
    B = new Set([2, 3]);

  const D = functions.difference(A, B);

  expect(Array.from(D)).toEqual([1, 4, 5]);
});

test('should properly compute the symmetric difference of two sets.', () => {
  const A = new Set([1, 2, 3]),
    B = new Set([3, 4, 5]);

  const S = functions.symmetricDifference(A, B);

  expect(Array.from(S)).toEqual([1, 2, 4, 5]);
});

test('isSubset should properly return if the first set is a subset of the second.', () => {
  const A = new Set([1, 2]),
    B = new Set([1, 2, 3]),
    C = new Set([2, 4]);

  expect(functions.isSubset(A, B)).toBe(true);
  expect(functions.isSubset(C, B)).toBe(false);
});

test('isSuperset should properly return if the first set is a subset of the second.', () => {
  const A = new Set([1, 2]),
    B = new Set([1, 2, 3]),
    C = new Set([2, 4]);

  expect(functions.isSuperset(B, A)).toBe(true);
  expect(functions.isSuperset(B, C)).toBe(false);
});

test('should properly add the second set to the first.', () => {
  const A = new Set([1, 2]);

  functions.add(A, new Set([2, 3]));

  expect(Array.from(A)).toEqual([1, 2, 3]);
});

test('should properly subtract the second set to the first.', () => {
  const A = new Set([1, 2]);

  functions.subtract(A, new Set([2, 3]));

  expect(Array.from(A)).toEqual([1]);
});

test('should properly intersect the second set to the first.', () => {
  const A = new Set([1, 2]);

  functions.intersect(A, new Set([2, 3]));

  expect(Array.from(A)).toEqual([2]);
});

test('should properly disjunct the second set to the first.', () => {
  const A = new Set([1, 2]);

  functions.disjunct(A, new Set([2, 3]));

  expect(Array.from(A)).toEqual([1, 3]);
});

test('should properly return the size of the intersection.', () => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const N = new Set([]);

  expect(functions.intersectionSize(A, B)).toBe(2);
  expect(functions.intersectionSize(A, N)).toBe(0);
});

test('should properly return the size of the union.', () => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const N = new Set([]);

  expect(functions.unionSize(A, B)).toBe(4);
  expect(functions.unionSize(A, N)).toBe(3);
});

test('should properly return the Jaccard similarity between two sets.', () => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const N = new Set([]);

  expect(functions.jaccard(A, B)).toBe(2 / 4);
  expect(functions.jaccard(A, N)).toBe(0);

  expect(functions.jaccard(new Set('contact'), new Set('context'))).toBe(4 / 7);
});

test('should properly return the overlap coefficient between two sets.', () => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const N = new Set([]);

  expect(functions.overlap(A, B)).toBe(2 / 3);
  expect(functions.overlap(A, N)).toBe(0);

  expect(functions.overlap(new Set('contact'), new Set('context'))).toBe(4 / 5);
});
