import { emptyPackage, prefreshPlus } from '@hawaii-bus-plus/vite-plugins';
import { AliasOptions, defineConfig } from 'vite';

const productionMode = false && process.env.NETLIFY_CONTEXT === 'production';
const alias: AliasOptions = {
  react: 'preact/compat',
  'react-dom': 'preact/compat',
};

if (productionMode) {
  alias['preact/debug'] = '@empty';
  alias['proposal-temporal'] = 'proposal-temporal/lib/index.mjs';
}

export default defineConfig({
  plugins: [emptyPackage('@empty'), prefreshPlus()],
  resolve: { alias },
  optimizeDeps: {
    include: [
      'mnemonist/default-map',
      'mnemonist/set',
      'preact',
      'preact/debug',
      'preact/hooks',
    ],
  },
  json: {
    stringify: true,
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    minify: process.env.NETLIFY_CONTEXT === 'production',
  },
  server: {
    proxy: {
      '/api/v1/lookup_location': {
        target: `http://api.ipstack.com/check?access_key=${process.env.IPSTACK_KEY}&fields=latitude,longitude`,
        changeOrigin: true,
      },
    },
  },
});
