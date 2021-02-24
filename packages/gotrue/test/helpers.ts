// eslint-disable-next-line ava/use-test
import { ExecutionContext } from 'ava';
import { GoTrue } from '../src/index.js';

export const auth = new GoTrue({
  APIUrl: 'https://app.hawaiibusplus.com/.netlify/identity',
});

export function instanceOf<T extends new (...args: any) => any>(
  t: ExecutionContext,
  actual: unknown,
  classType: T
): asserts actual is InstanceType<T> {
  t.true(actual instanceof classType);
}
