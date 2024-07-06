// @ts-check
import { readFile } from 'node:fs/promises';
import { defineConfig } from 'vite';
import { injectHtml } from '@hawaii-bus-plus/vite-plugins';
import preact from '@preact/preset-vite';

const headHtmlIncludeFile = new URL('./head.html', import.meta.url);

export default defineConfig(({ command, isSsrBuild }) => {
  /** @type {import('vite').UserConfig & { build: import('vite').BuildOptions }} */
  const baseConfig = {
    plugins: [
      injectHtml({
        head: readFile(headHtmlIncludeFile, 'utf-8'),
      }),
      preact({
        include: ['{page,share,assets,components}/**/*'],
        exclude: ['worker-*/**'],
      }),
    ],
    optimizeDeps: {
      include: ['preact', 'preact/hooks'],
    },
    json: {
      stringify: true,
    },
    define: command === 'build' ? { globalThis: 'self' } : undefined,
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
          404: './404.html',
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
        'node:fs/promises',
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
    },
  };

  if (isSsrBuild === true) {
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
            share: './share/entry-server.tsx',
          },
        },
      },
    };
  } else {
    return baseConfig;
  }
});
