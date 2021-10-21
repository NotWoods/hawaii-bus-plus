// @ts-check
import { defineConfig } from 'vite';
import { emptyPackage } from '@hawaii-bus-plus/vite-plugins';
import prefresh from '@prefresh/vite';

export default defineConfig(({ command }) => {
  /** @type {import('vite').AliasOptions} */
  const alias = {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
  };

  return {
    plugins: [
      command === 'build' && emptyPackage('preact/debug'),
      prefresh({
        // @ts-expect-error prefresh type issues
        include: ['{auth,page,share,assets,components}/**/*'],
        exclude: ['worker-*/**'],
      }),
    ].filter(Boolean),
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
      globalThis: 'self',
    },
    build: {
      manifest: true,
      ssrManifest: true,
      outDir: '../../dist',
      emptyOutDir: true,
      cssCodeSplit: false,
      minify: 'esbuild',
      polyfillDynamicImport: false,
      rollupOptions: {
        treeshake: {
          // moduleSideEffects: false,
        },
        input: {
          main: './index.html',
          auth: './auth/index.html',
          share: './share/index.html',
        },
        output: {
          manualChunks: undefined,
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
  };
});
