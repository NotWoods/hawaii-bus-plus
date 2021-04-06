import { readFile, writeFile } from 'fs/promises';
import { createRequire } from 'module';
import { resolve } from 'path';
import type { OutputAsset } from 'rollup';
import { Promisable } from 'type-fest';
import { fileURLToPath, URL } from 'url';
import { build } from 'vite';
import { injectHelmet } from './helmet.js';

export type RenderFunction = (
  url: URL,
  ...args: unknown[]
) => Promisable<{ html: string; head?: string }>;

export const distFolder = new URL('../../../dist/', import.meta.url);
export const clientFolder = new URL('../../client/', import.meta.url);

export async function buildPrerenderCode(
  input: string,
  args: Record<string, unknown> = {},
) {
  const root = fileURLToPath(clientFolder);
  const external = ['preact', 'tailwindcss', 'fs/promises'];

  const buildResult = await build({
    root,
    css: {
      postcss: '',
    },
    define: {
      globalThis: 'global',
    },
    build: {
      minify: false,
      write: false,
      ssr: input,
      manifest: false,
      ssrManifest: false,
      rollupOptions: {
        input: resolve(root, input),
        external,
      },
    },
    // @ts-expect-error bug in vite type deps
    ssr: {
      external,
    },
  });

  if (Array.isArray(buildResult)) {
    throw new Error(`output from vite is an array`);
  }
  const { output } = buildResult;

  const [{ code, fileName }] = output;
  const module = { exports: {} as { [name: string]: unknown } };
  const require = createRequire(resolve(root, fileName));
  const params = ['module', 'exports', 'require', ...Object.keys(args)].concat(
    code,
  );

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const func = new Function(...params);
  let error: unknown;
  try {
    func(...[module, module.exports, require, ...Object.values(args)]);
  } catch (err: unknown) {
    error = err;
  }

  const assets = output.filter(
    (chunk): chunk is OutputAsset => chunk.type === 'asset',
  );

  return { code, module, assets, error };
}

export function renderTemplate(
  template: string,
  appHtml: string,
  headHtml = '',
) {
  return template
    .replace(`<!--app-html-->`, appHtml)
    .replace(`<!--head-html-->`, headHtml);
}

interface RenderRoutesOptions {
  templatePath: string;
  serverEntryPath: string;
  routes: string[];
  write?: boolean;
}

export async function renderRoutes(
  options: RenderRoutesOptions,
  ...args: unknown[]
) {
  const { templatePath, serverEntryPath, routes, write } = options;
  const templateReady = readFile(new URL(templatePath, distFolder), 'utf8');

  const { module } = await buildPrerenderCode(serverEntryPath);
  const render = module.exports.default as RenderFunction;

  return await Promise.all(
    routes.map(async (pathname) => {
      const url = new URL(pathname, 'https://app.hawaiibusplus.com');
      const { html, head } = await render(url, ...args);
      const rendered = injectHelmet(
        renderTemplate(await templateReady, html, head),
      );

      const withSuffix = pathname.endsWith('/')
        ? `${pathname}index.html`
        : `${pathname}.html`;
      const destPath = new URL(`.${withSuffix}`, distFolder);
      if (write) {
        await writeFile(destPath, rendered, 'utf8');
      }
      return { fileName: destPath.href, source: rendered };
    }),
  );
}
