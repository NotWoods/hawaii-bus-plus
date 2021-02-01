// import preactRefresh from '@prefresh/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // plugins: [preactRefresh()],
  alias: {
    'proposal-temporal': 'proposal-temporal/lib/index.mjs',
    react: 'preact/compat',
    'react-dom': 'preact/compat',
  },
  optimizeDeps: {
    include: ['mnemonist/set', 'preact', 'preact/debug', 'preact/hooks'],
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
        ignorePath: true,
      },
    },
  },
});
