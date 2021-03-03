import test from 'ava';
import * as functions from '../src/set.js';

test('should properly compute the intersection of two sets.', (t) => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const I = functions.intersection(A, B);

  t.deepEqual(Array.from(I), [2, 3]);
});

test('intersection should be variadic.', (t) => {
  const A = new Set([1, 2, 3, 4]),
    B = new Set([2, 3, 4]),
    C = new Set([1, 4]),
    D = new Set([4, 5, 6]);

  const I = functions.intersection(A, B, C, D);

  t.deepEqual(Array.from(I), [4]);
});

test('should properly compute the union of two sets.', (t) => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const U = functions.union(A, B);

  t.deepEqual(Array.from(U), [1, 2, 3, 4]);
});

test('union should be variadic.', (t) => {
  const A = new Set([1, 2, 3, 4]),
    B = new Set([2, 3, 4]),
    C = new Set([1, 4]),
    D = new Set([4, 5, 6]);

  const U = functions.union(A, B, C, D);

  t.deepEqual(Array.from(U), [1, 2, 3, 4, 5, 6]);
});

test('should properly compute the difference of two sets.', (t) => {
  const A = new Set([1, 2, 3, 4, 5]),
    B = new Set([2, 3]);

  const D = functions.difference(A, B);

  t.deepEqual(Array.from(D), [1, 4, 5]);
});

test('should properly compute the symmetric difference of two sets.', (t) => {
  const A = new Set([1, 2, 3]),
    B = new Set([3, 4, 5]);

  const S = functions.symmetricDifference(A, B);

  t.deepEqual(Array.from(S), [1, 2, 4, 5]);
});

test('isSubset should properly return if the first set is a subset of the second.', (t) => {
  const A = new Set([1, 2]),
    B = new Set([1, 2, 3]),
    C = new Set([2, 4]);

  t.is(functions.isSubset(A, B), true);
  t.is(functions.isSubset(C, B), false);
});

test('isSuperset should properly return if the first set is a subset of the second.', (t) => {
  const A = new Set([1, 2]),
    B = new Set([1, 2, 3]),
    C = new Set([2, 4]);

  t.is(functions.isSuperset(B, A), true);
  t.is(functions.isSuperset(B, C), false);
});

test('should properly add the second set to the first.', (t) => {
  const A = new Set([1, 2]);

  functions.add(A, new Set([2, 3]));

  t.deepEqual(Array.from(A), [1, 2, 3]);
});

test('should properly subtract the second set to the first.', (t) => {
  const A = new Set([1, 2]);

  functions.subtract(A, new Set([2, 3]));

  t.deepEqual(Array.from(A), [1]);
});

test('should properly intersect the second set to the first.', (t) => {
  const A = new Set([1, 2]);

  functions.intersect(A, new Set([2, 3]));

  t.deepEqual(Array.from(A), [2]);
});

test('should properly disjunct the second set to the first.', (t) => {
  const A = new Set([1, 2]);

  functions.disjunct(A, new Set([2, 3]));

  t.deepEqual(Array.from(A), [1, 3]);
});

test('should properly return the size of the intersection.', (t) => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const N = new Set([]);

  t.is(functions.intersectionSize(A, B), 2);
  t.is(functions.intersectionSize(A, N), 0);
});

test('should properly return the size of the union.', (t) => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const N = new Set([]);

  t.is(functions.unionSize(A, B), 4);
  t.is(functions.unionSize(A, N), 3);
});

test('should properly return the Jaccard similarity between two sets.', (t) => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const N = new Set([]);

  t.is(functions.jaccard(A, B), 2 / 4);
  t.is(functions.jaccard(A, N), 0);

  t.is(functions.jaccard(new Set('contact'), new Set('context')), 4 / 7);
});

test('should properly return the overlap coefficient between two sets.', (t) => {
  const A = new Set([1, 2, 3]),
    B = new Set([2, 3, 4]);

  const N = new Set([]);

  t.is(functions.overlap(A, B), 2 / 3);
  t.is(functions.overlap(A, N), 0);

  t.is(functions.overlap(new Set('contact'), new Set('context')), 4 / 5);
});
