import { expect, test } from 'ava';
import { parse } from '../src/parser.js';

test('should parse html and return root element', () => {
  const root = parse(
    '<p id="id"><a class=\'cls\'>Hello</a><ul><li><li></ul><span></span></p>',
  );

  expect(root).toBeTruthy();
});
