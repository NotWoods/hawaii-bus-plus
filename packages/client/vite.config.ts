import { emptyPackage, prefreshPlus } from '@hawaii-bus-plus/vite-plugins';
import { AliasOptions, defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const productionMode = process.env.NETLIFY_CONTEXT === 'production';
const alias: AliasOptions = {
  'insights-js': 'insights-js/dist/esnext/index.js',
  react: 'preact/compat',
  'react-dom': 'preact/compat',
};

if (productionMode) {
  alias['proposal-temporal'] = 'proposal-temporal/lib/index.mjs';
}

export default defineConfig({
  plugins: [
    emptyPackage('preact/debug'),
    prefreshPlus(),
    VitePWA({
      mode: productionMode ? 'production' : 'development',
      minify: productionMode,
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [
          new RegExp('/routes/'),
          new RegExp('/directions'),
        ],
      },
      manifest: {
        short_name: 'Hawaii Bus+',
        name: 'Hawaii Bus Plus',
        start_url: '/',
        background_color: '#f9fafb',
        theme_color: '#32383e',
        icons: [
          {
            src: '/icon/transparent.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
          {
            src: '/icon/maskable.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
          {
            src: '/icon/small.png',
            type: 'image/png',
            sizes: '48x48',
            purpose: 'any',
          },
          {
            src: '/icon/monochrome.png',
            type: 'image/png',
            sizes: '48x48',
            purpose: 'monochrome',
          },
          {
            src: '/icon/monochrome.svg',
            type: 'image/svg+xml',
            sizes: 'any',
            purpose: 'monochrome',
          },
        ],
      },
    }),
  ],
  resolve: { alias },
  optimizeDeps: {
    include: ['preact', 'preact/debug', 'preact/hooks'],
  },
  json: {
    stringify: true,
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  define: {
    // globalThis: 'self',
  },
  build: {
    manifest: true,
    ssrManifest: true,
    outDir: '../../dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: productionMode,
    rollupOptions: {
      input: {
        main: './index.html',
        auth: './auth/index.html',
      },
    },
  },
  server: {
    proxy: {
      '/api/v1/lookup_location': {
        target: `http://api.ipstack.com/check?access_key=${process.env.IPSTACK_KEY}&fields=latitude,longitude`,
        changeOrigin: true,
      },
    },
    force: true,
  },
});
