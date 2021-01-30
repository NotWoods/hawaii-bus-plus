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
  server: {
    proxy: {
      '/api/ipstack': {
        target: `http://api.ipstack.com/check?access_key=${'4ab5e9207c5c5db9d7dd29604a7dd6dc'}&fields=latitude,longitude`,
        changeOrigin: true,
        ignorePath: true,
      },
    },
  },
});
