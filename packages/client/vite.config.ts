import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRefresh()],
  alias: {
    'proposal-temporal': 'proposal-temporal/lib/index.mjs',
  },
  optimizeDeps: {
    include: ['mnemonist/set'],
  },
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    minify: false && process.env.NODE_ENV === 'production',
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
