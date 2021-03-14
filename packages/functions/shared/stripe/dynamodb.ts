import {
  DeleteItemCommand,
  DescribeTableCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';

export class DatabaseClient {
  dynamoDb = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
    },
  });

  async debug() {
    return await this.dynamoDb.send(
      new DescribeTableCommand({
        TableName: 'Users',
      })
    );
  }

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

  async deleteUser(netlifyId: string) {
    await this.dynamoDb.send(
      new DeleteItemCommand({
        TableName: 'Users',
        Key: {
          netlifyId: { S: netlifyId },
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
      new QueryCommand({
        TableName: 'Users',
        ProjectionExpression: 'netlifyId',
        IndexName: 'stripeId',
        KeyConditionExpression: 'stripeId = :id',
        ExpressionAttributeValues: {
          ':id': { S: stripeId },
        },
      })
    );
    return data.Items?.[0]?.['netlifyId']?.S;
  }
}

export const database = new DatabaseClient();
