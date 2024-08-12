// @ts-check
/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    exclude: ['node_modules', 'e2e/**/*'],
  },
});
