import test, {
  ExecutionContext,
  Implementation,
  ImplementationResult,
} from 'ava';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { DatabaseClient } from '../../../shared/stripe/dynamodb.js';

config({
  path: fileURLToPath(new URL('../../../../../.env', import.meta.url)),
});

let client: DatabaseClient | undefined;
if (process.env.AMAZON_ACCESS_KEY_ID && process.env.AMAZON_SECRET_ACCESS_KEY) {
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
  implementation: (t: ExecutionContext<Context>) => ImplementationResult
) {
  if (client) {
    test(title, (t) => {
      const ctx = t.context as Context;
      ctx.client = client!;
      return implementation(t as ExecutionContext<Context>);
    });
  } else {
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip(title, implementation as Implementation);
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
