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
});
