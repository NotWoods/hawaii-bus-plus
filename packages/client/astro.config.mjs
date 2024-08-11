// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

const spaRouting = {
  '/directions': '/',
  '/routes/[...slug]': '/',
};

export default defineConfig({
  integrations: [preact(), tailwind()],
  srcDir: 'astro',
  outDir: '../../dist/',
  output: 'static',
  build: {
    format: 'preserve',
    assets: 'assets',
  },
  redirects: {
    // Use SPA routing in dev mode
    // In build mode, netlify.toml handles this instead
    ...(process.env.NODE_ENV === 'production' ? undefined : spaRouting),
  },
  vite: {
    resolve: {
      alias: {
        // Fix some weird build error
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
    define:
      process.env.NODE_ENV === 'production'
        ? { globalThis: 'self' }
        : undefined,
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
