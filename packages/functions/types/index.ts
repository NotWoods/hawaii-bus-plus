import type {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

export type NetlifyEvent = APIGatewayEvent;

export interface NetlifyContext extends Omit<Context, 'clientContext'> {
  clientContext: {
    custom: {
      netlify: string;
    };
    identity?: {
      url: string;
      token: string;
    };
    user?: unknown;
  };
}

export type NetlifyResponse = APIGatewayProxyResult;
