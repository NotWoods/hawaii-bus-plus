import { NodeRepository } from '@hawaii-bus-plus/data/node/index.js';
import { URL } from 'url';
import { clientFolder, renderRoutes } from './base.js';

export async function prerenderPage(write: boolean) {
  const repo = new NodeRepository(
    new URL('./public/api/v1/api.json', clientFolder)
  );

  return await renderRoutes(
    {
      templatePath: './index.html',
      serverEntryPath: './page/entry-server.tsx',
      routes: ['/'],
      write,
    },
    repo
  );
}
