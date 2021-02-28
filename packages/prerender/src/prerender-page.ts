import { renderRoutes } from './base.js';

export async function prerenderPage(write: boolean) {
  return await renderRoutes({
    templatePath: './index.html',
    serverEntryPath: './page/entry-server.tsx',
    routes: ['/'],
    write,
  });
}
