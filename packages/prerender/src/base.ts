import { readFile, writeFile } from 'fs/promises';
import { createRequire } from 'module';
import { resolve } from 'path';
import type { OutputAsset, RollupOutput } from 'rollup';
import { Promisable } from 'type-fest';
import { fileURLToPath, URL } from 'url';
import { build } from 'vite';
import { injectHelmet } from './helmet.js';

export type RenderFunction = (
  url: URL,
  ...args: unknown[]
) => Promisable<{ html: string }>;

export const distFolder = new URL('../../../dist/', import.meta.url);
export const clientFolder = new URL('../../client/', import.meta.url);

export async function buildPrerenderCode(
  input: string,
  args: Record<string, unknown> = {},
) {
  const root = fileURLToPath(clientFolder);
  const external = [
    'preact',
    'tailwindcss',
    'fs/promises',
    '@notwoods/preact-helmet',
  ];

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
  const { output } = buildResult as RollupOutput;

  const [{ code, fileName }] = output;
  const module = {
    exports: {} as { [name: string]: unknown; default?: unknown },
  };
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

export function renderTemplate(template: string, appHtml: string) {
  return template.replace(`<!--app-html-->`, appHtml);
}

interface RenderRoutesOptions {
  templatePath: string;
  serverEntryPath: string;
  routes: string[];
  write?: boolean;
}

export interface RenderRoutesResult {
  fileName: string;
  source: string;
}

export async function renderRoutes(
  options: RenderRoutesOptions,
  ...args: unknown[]
): Promise<RenderRoutesResult[]> {
  console.log(`Render ${options.serverEntryPath}`);
  const { templatePath, serverEntryPath, routes, write } = options;
  const templateReady = readFile(new URL(templatePath, distFolder), 'utf8');

  const { module, error } = await buildPrerenderCode(serverEntryPath);
  const render = module.exports.default as RenderFunction;
  if (error) {
    throw error;
  }

  const writeJobs: Promise<RenderRoutesResult>[] = [];
  for (const pathname of routes) {
    const url = new URL(pathname, 'https://app.hawaiibusplus.com');
    const { html } = await render(url, ...args);
    const rendered = injectHelmet(renderTemplate(await templateReady, html));

    const withSuffix = pathname.endsWith('/')
      ? `${pathname}index.html`
      : `${pathname}.html`;
    const destPath = new URL(`.${withSuffix}`, distFolder);

    const result = { fileName: destPath.href, source: rendered };
    if (write) {
      writeJobs.push(writeFile(destPath, rendered, 'utf8').then(() => result));
    } else {
      writeJobs.push(Promise.resolve(result));
    }
  }

  return await Promise.all(writeJobs);
}
