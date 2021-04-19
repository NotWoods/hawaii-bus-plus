import {
  emptyPackage,
  webWorkerCodeSplit,
} from '@hawaii-bus-plus/vite-plugins';
import prefresh from '@prefresh/vite';
import { defineConfig } from 'vite';

const productionMode = true || process.env.NETLIFY_CONTEXT === 'production';
/** @type {import('vite').AliasOptions} */
const alias = {
  'insights-js': 'insights-js/dist/esnext/index.js',
  react: 'preact/compat',
  'react-dom': 'preact/compat',
};

if (productionMode) {
  alias['proposal-temporal'] = 'proposal-temporal/lib/index.mjs';
}

export default defineConfig({
  plugins: [
    webWorkerCodeSplit(),
    emptyPackage('preact/debug'),
    prefresh({
      include: ['{auth,page,share,all-pages}/**/*'],
      exclude: ['worker-*/**'],
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
        share: './share/index.html',
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
