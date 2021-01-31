import type {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

export interface NetlifyEvent extends APIGatewayEvent {}

export interface NetlifyContext extends Omit<Context, 'clientContext'> {
  clientContext: {
    custom: {
      netlify: string;
    };
    identity?: {
      url: string;
      token: string;
    };
    user?: object;
  };
}

export interface NetlifyResponse extends APIGatewayProxyResult {}
