import type {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

export type NetlifyEvent = APIGatewayEvent;

export interface NetlifyIdentityContext {
  url: string;
  token: string;
}

export interface NetlifyContext extends Omit<Context, 'clientContext'> {
  clientContext: {
    custom: {
      netlify: string;
    };
    identity: NetlifyIdentityContext;
    user?: unknown;
  };
}

export type NetlifyResponse = APIGatewayProxyResult;
