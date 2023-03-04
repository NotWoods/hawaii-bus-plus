import test, { ImplementationFn, TestFn } from 'ava';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { DatabaseClient } from '../../../shared/stripe/dynamodb.js';

config({
  path: fileURLToPath(new URL('../../../../../.env', import.meta.url)),
});

let client: DatabaseClient | undefined;
if (
  process.env['AMAZON_ACCESS_KEY_ID'] &&
  process.env['AMAZON_SECRET_ACCESS_KEY']
) {
  client = new DatabaseClient();
}

test.before(async () => {
  if (client) {
    await client.createUser('TEST-NID', 'TEST-SID');
  }
});

test.after.always(async () => {
  if (client) {
    await client.deleteUser('TEST-NID');
  }
});

interface Context {
  client: DatabaseClient;
}

function clientTest(
  title: string,
  implementation: ImplementationFn<[], Context>,
) {
  const testWithContext = test as TestFn<Context>;
  if (client) {
    testWithContext(title, (t) => {
      t.context.client = client!;
      return implementation(t);
    });
  } else {
    // eslint-disable-next-line vitest/no-disabled-tests
    testWithContext.skip(title, implementation);
  }
}

clientTest('check table info', async (t) => {
  const tableInfo = await t.context.client.debug();
  t.deepEqual(tableInfo.Table?.AttributeDefinitions, [
    {
      AttributeName: 'netlifyId',
      AttributeType: 'S',
    },
    {
      AttributeName: 'stripeId',
      AttributeType: 'S',
    },
  ]);
  t.deepEqual(tableInfo.Table?.GlobalSecondaryIndexes?.[0]?.KeySchema, [
    {
      AttributeName: 'stripeId',
      KeyType: 'HASH',
    },
  ]);
});

clientTest('get stripe ID from netlify ID', async (t) => {
  t.is(await t.context.client.getUserByNetlifyId('TEST-NID'), 'TEST-SID');
});

clientTest('get netlify ID from stripe ID', async (t) => {
  t.is(await t.context.client.getUserByStripeId('TEST-SID'), 'TEST-NID');
});
