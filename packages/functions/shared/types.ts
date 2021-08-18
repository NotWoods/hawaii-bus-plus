import {
  HandlerContext,
  HandlerEvent,
  HandlerResponse,
} from '@netlify/functions';

export type NetlifyEvent = HandlerEvent;

export interface NetlifyIdentityContext {
  url: string;
  token: string;
}

export interface NetlifyContext extends HandlerContext {
  clientContext: {
    custom: {
      netlify: string;
    };
    identity?: NetlifyIdentityContext;
    user?: unknown;
  };
}

export type NetlifyResponse = HandlerResponse;
