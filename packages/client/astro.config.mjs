// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [preact(), tailwind()],
  srcDir: 'astro',
  outDir: '../../dist/',
  build: {
    format: 'preserve',
  },
  vite: {
    resolve: {
      alias: {
        '@googlemaps/js-api-loader':
          '@googlemaps/js-api-loader/dist/index.esm.js',
      },
    },

    optimizeDeps: {
      include: ['preact', 'preact/hooks'],
    },
    json: {
      stringify: true,
    },
    ssr: {
      external: [
        'preact',
        'tailwindcss',
        'node:fs/promises',
        '@notwoods/preact-helmet',
      ],
      noExternal: ['clsx'],
    },

    server: {
      proxy: {
        '/api/v1/lookup_location': {
          target: `http://api.ipstack.com/check?access_key=${process.env.IPSTACK_KEY}&fields=latitude,longitude`,
          changeOrigin: true,
        },
      },
    },
  },
});
