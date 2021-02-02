import { applyOffset } from './helpers';

test.concurrent('applyOffset', () => {
  expect(applyOffset('Google abc', 3)).toBe('Goo abc');
  expect(applyOffset('Google abc', 8)).toBe('Google a');

  expect(applyOffset('Google abc', 10)).toBe('Google abc');
  expect(applyOffset('Google abc', 6)).toBe('Google abc');

  expect(applyOffset('Google abc', 0)).toBe(' abc');
  expect(applyOffset('Google abc', 7)).toBe('Google ');
});
