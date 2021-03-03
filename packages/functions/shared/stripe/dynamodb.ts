import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';

export class DatabaseClient {
  dynamoDb = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
    },
  });

  async createUser(netlifyId: string, stripeId: string) {
    await this.dynamoDb.send(
      new PutItemCommand({
        TableName: 'Users',
        Item: {
          netlifyId: { S: netlifyId },
          stripeId: { S: stripeId },
        },
      })
    );
  }

  async getUserByNetlifyId(netlifyId: string) {
    const data = await this.dynamoDb.send(
      new GetItemCommand({
        TableName: 'Users',
        Key: {
          netlifyId: { S: netlifyId },
        },
        ProjectionExpression: 'stripeId',
      })
    );
    return data.Item?.['stripeId']?.S;
  }

  async getUserByStripeId(stripeId: string) {
    const data = await this.dynamoDb.send(
      new GetItemCommand({
        TableName: 'Users',
        Key: {
          stripeId: { S: stripeId },
        },
        ProjectionExpression: 'netlifyId',
      })
    );
    return data.Item?.['netlifyId']?.S;
  }
}

export const database = new DatabaseClient();
