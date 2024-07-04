import { readFile, writeFile } from 'node:fs/promises';
import type { Promisable } from 'type-fest';
import { URL } from 'node:url';
import { injectHelmet } from './helmet.js';

export type RenderFunction = (
  url: URL,
  ...args: unknown[]
) => Promisable<{ html: string }>;

export const distFolder = new URL('../../../dist/', import.meta.url);
export const builtSsrFolder = new URL('../dist/', import.meta.url);

export function renderTemplate(template: string, appHtml: string) {
  return template.replace(`<!--app-html-->`, appHtml);
}

interface RenderRoutesOptions {
  templatePath: string;
  /**
   * Path to the build SSR entry file
   */
  serverEntryPath: string;
  routes: string[];
  write?: boolean;
}

export interface RenderRoutesResult {
  fileName: string;
  source: string;
}

export async function renderRoutes(
  { templatePath, serverEntryPath, routes, write }: RenderRoutesOptions,
  ...args: unknown[]
): Promise<RenderRoutesResult[]> {
  console.log(`Render ${serverEntryPath}`);
  const templateReady = readFile(new URL(templatePath, distFolder), 'utf8');

  const module = await import(new URL(serverEntryPath, builtSsrFolder).href);
  const render = (module as { default: unknown }).default as (
    url: URL,
    ...args: unknown[]
  ) => Promise<{ html: string }>;

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
