// import preactRefresh from '@prefresh/vite';
import { AliasOptions, defineConfig, Plugin } from 'vite';

function emptyPackage(name: string): Plugin {
  return {
    name: 'empty',
    load(id) {
      if (id === name) {
        return 'export {}';
      }
      return undefined;
    },
  };
}

const productionMode = false && process.env.NETLIFY_CONTEXT === 'production';
const alias: AliasOptions = {
  react: 'preact/compat',
  'react-dom': 'preact/compat',
};

if (productionMode) {
  alias['preact/debug'] = '@empty';
}

export default defineConfig({
  plugins: [emptyPackage('@empty')],
  alias,
  optimizeDeps: {
    include: ['mnemonist/set', 'preact', 'preact/debug', 'preact/hooks'],
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
    minify: false && process.env.NETLIFY_CONTEXT === 'production',
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
