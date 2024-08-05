import { defineMiddleware } from 'astro:middleware';
import { DIRECTIONS_PATH, ROUTES_PREFIX } from '../page/router/state';

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware((context, next) => {
  if (
    context.url.pathname.startsWith(DIRECTIONS_PATH) ||
    context.url.pathname.startsWith(ROUTES_PREFIX)
  ) {
    return context.rewrite('/');
  }

  return next();
});
