// @ts-check
import { readFile } from 'fs/promises';
import { defineConfig } from 'vite';
import { emptyPackage, injectHtml } from '@hawaii-bus-plus/vite-plugins';
import prefresh from '@prefresh/vite';

const headHtmlIncludeFile = new URL('./head.html', import.meta.url);

export default defineConfig(({ command, ssrBuild }) => {
  /** @type {import('vite').AliasOptions} */
  const alias = {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
  };

  /** @type {import('vite').UserConfig & { build: import('vite').BuildOptions }} */
  const baseConfig = {
    plugins: [
      command === 'build' && emptyPackage('preact/debug'),
      injectHtml({
        head: readFile(headHtmlIncludeFile, 'utf-8'),
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
    define: { globalThis: 'self' },
    build: {
      manifest: true,
      ssrManifest: true,
      outDir: '../../dist/',
      emptyOutDir: true,
      cssCodeSplit: false,
      minify: 'esbuild',
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
    ssr: {
      external: [
        'preact',
        'tailwindcss',
        'fs/promises',
        '@notwoods/preact-helmet',
      ],
      noExternal: ['clsx'],
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

  if (ssrBuild === true) {
    return {
      ...baseConfig,
      define: undefined,
      build: {
        ...baseConfig.build,
        ssrManifest: false,
        ssr: true,
        outDir: '../prerender/dist/',
        minify: false,
        rollupOptions: {
          ...baseConfig.build.rollupOptions,
          input: {
            main: './page/entry-server.tsx',
            auth: './auth/entry-server.tsx',
            share: './share/entry-server.tsx',
          },
        },
      },
    };
  } else {
    return baseConfig;
  }
});
