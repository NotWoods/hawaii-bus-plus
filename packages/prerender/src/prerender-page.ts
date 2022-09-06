import { renderRoutes } from './base.js';

export async function prerenderPage(write: boolean) {
  return await renderRoutes({
    templatePath: './index.html',
    serverEntryPath: './main.js',
    routes: ['/'],
    write,
  });
}
