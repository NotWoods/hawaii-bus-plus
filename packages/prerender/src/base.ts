import { readFile, writeFile } from 'fs/promises';
import { URL } from 'url';

const distFolder = new URL('../../../dist/', import.meta.url);

export function renderTemplate(
  template: string,
  appHtml: string,
  headHtml = ''
) {
  return template
    .replace(`<!--app-html-->`, appHtml)
    .replace(`<!--head-html-->`, headHtml);
}

export async function renderRoutes(
  templatePath: string,
  serverEntryPath: string,
  routes: string[]
) {
  const templateReady = readFile(
    new URL(`./${templatePath}`, distFolder),
    'utf8'
  );

  const { default: render } = (await import(
    new URL(`./${serverEntryPath}`, distFolder).href
  )) as { default: (url: URL) => Promise<{ html: string; head?: string }> };

  await Promise.all(
    routes.map(async (pathname) => {
      const url = new URL(pathname, 'https://app.hawaiibusplus.com');
      const { html, head } = await render(url);
      const rendered = renderTemplate(await templateReady, html, head);

      const withSuffix = pathname.endsWith('/')
        ? `${pathname}index.html`
        : `${pathname}.html`;
      const destPath = new URL(`.${withSuffix}`, distFolder);
      await writeFile(destPath, rendered, 'utf8');
    })
  );
}
