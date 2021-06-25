/* eslint-disable @typescript-eslint/no-floating-promises */

import { PROD_LOCATION, setupAnalytics } from './analytics';
import { registerServiceWorker } from './service-worker';

/**
 * Shared asyncronous setup for all pages.
 */

if (PROD_LOCATION) {
  setupAnalytics();
}

registerServiceWorker();
