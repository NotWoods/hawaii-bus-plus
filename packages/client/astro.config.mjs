// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [preact(), tailwind()],
  srcDir: 'astro',
  vite: {
    resolve: {
      alias: {
        '@googlemaps/js-api-loader':
          '@googlemaps/js-api-loader/dist/index.esm.js',
      },
    },
  },
});
