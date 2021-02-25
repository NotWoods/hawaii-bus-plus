import { readFile, writeFile } from 'fs/promises';
import { createRequire } from 'module';
import { resolve } from 'path';
import type { OutputAsset } from 'rollup';
import { Promisable } from 'type-fest';
import { fileURLToPath, URL } from 'url';
import { build } from 'vite';

export type RenderFunction = (
  url: URL
) => Promisable<{ html: string; head?: string }>;

export const distFolder = new URL('../../../dist/', import.meta.url);
export const clientFolder = new URL('../../client/', import.meta.url);

export async function buildPrerenderCode(input: string) {
  const root = fileURLToPath(clientFolder);
  const buildResult = await build({
    root,
    css: {
      postcss: '',
    },
    build: {
      minify: false,
      write: false,
      ssr: input,
      manifest: false,
      ssrManifest: false,
      rollupOptions: {
        input: resolve(root, input),
        external: ['preact', 'tailwindcss'],
      },
    },
    // @ts-expect-error bug in vite type deps
    ssr: {
      external: ['preact', 'tailwindcss'],
    },
  });

  if (Array.isArray(buildResult)) {
    throw new Error(`output from vite is an array`);
  }
  const { output } = buildResult;

  const [{ code, fileName }] = output;
  const module = { exports: {} as { [name: string]: unknown } };
  const require = createRequire(resolve(root, fileName));
  const params = ['module', 'exports', 'require'].concat(code);

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const func = new Function(...params);
  func(...[module, module.exports, require]);

  const assets = output.filter(
    (chunk): chunk is OutputAsset => chunk.type === 'asset'
  );

  return { code, module, assets };
}

export function renderTemplate(
  template: string,
  appHtml: string,
  headHtml = ''
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

export async function renderRoutes(options: RenderRoutesOptions) {
  const { templatePath, serverEntryPath, routes, write } = options;
  const templateReady = readFile(new URL(templatePath, distFolder), 'utf8');

  const { module } = await buildPrerenderCode(serverEntryPath);
  const render = module.exports.default as RenderFunction;

  return await Promise.all(
    routes.map(async (pathname) => {
      const url = new URL(pathname, 'https://app.hawaiibusplus.com');
      const { html, head } = await render(url);
      const rendered = renderTemplate(await templateReady, html, head);

      const withSuffix = pathname.endsWith('/')
        ? `${pathname}index.html`
        : `${pathname}.html`;
      const destPath = new URL(`.${withSuffix}`, distFolder);
      if (write) {
        await writeFile(destPath, rendered, 'utf8');
      }
      return { fileName: destPath.href, source: rendered };
    })
  );
}
