// @ts-check
import {
  emptyPackage,
  webWorkerCodeSplit,
} from '@hawaii-bus-plus/vite-plugins';
import prefresh from '@prefresh/vite';

/**
 * @param {object} param1
 * @param {'serve' | 'build'} param1.command
 * @param {'development' | 'production'} param1.mode
 * @returns {import('vite').UserConfig}
 */
export default function vite({}) {
  /** @type {import('vite').AliasOptions} */
  const alias = {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
  };

  return {
    plugins: [
      webWorkerCodeSplit(),
      emptyPackage('preact/debug'),
      prefresh({
        // @ts-expect-error prefresh type issues
        include: ['{auth,page,share,assets,components}/**/*'],
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
}
