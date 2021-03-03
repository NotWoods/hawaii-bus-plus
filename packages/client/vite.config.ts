import { emptyPackage, prefreshPlus } from '@hawaii-bus-plus/vite-plugins';
import { AliasOptions, defineConfig } from 'vite';

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
  plugins: [emptyPackage('preact/debug'), prefreshPlus()],
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
