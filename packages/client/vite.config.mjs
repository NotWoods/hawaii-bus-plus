// @ts-check
import { defineConfig } from 'vite';
import { headHtml } from '@hawaii-bus-plus/tailwind-theme';
import { emptyPackage, injectHtml } from '@hawaii-bus-plus/vite-plugins';
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
      injectHtml({
        head: headHtml().then(
          (html) =>
            (html += `
<link rel="icon" type="image/svg+xml" sizes="any" href="/icon/favicon.svg" />
<link rel="icon" type="image/png" sizes="512x512" href="/icon/favicon-512.png" />
<link rel="icon" type="image/png" sizes="48x48" href="/icon/favicon.png" />
<link rel="apple-touch-icon" sizes="512x512" href="/icon/maskable.png" />
<link rel="manifest" href="/manifest.webmanifest" />`),
        ),
      }),
      prefresh({
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
