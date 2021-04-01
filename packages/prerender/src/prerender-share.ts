import { NodeRepository } from '@hawaii-bus-plus/data/node/index.js';
import { mkdir } from 'fs/promises';
import { URL } from 'url';
import { distFolder, renderRoutes } from './base.js';

export async function prerenderShare(write: boolean) {
  const repo = new NodeRepository();
  const [routes] = await Promise.all([
    repo.loadAllRoutes(),
    mkdir(new URL('./share/routes/', distFolder)),
  ]);

  return await renderRoutes(
    {
      templatePath: './share/index.html',
      serverEntryPath: './share/entry-server.tsx',
      routes: routes.map((route) => `/share/routes/${route.route_id}`),
      write,
    },
    repo
  );
}
