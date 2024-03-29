import { mkdir } from 'node:fs/promises';
import { URL } from 'node:url';
import { distFolder, renderRoutes } from './base.js';
import { NodeJsonRepository } from './repository.js';

export async function prerenderShare(write: boolean) {
  const repo = new NodeJsonRepository();
  const [routes] = await Promise.all([
    repo.loadAllRoutes(),
    mkdir(new URL('./share/routes/', distFolder), { recursive: true }),
  ]);

  return await renderRoutes(
    {
      templatePath: './share/index.html',
      serverEntryPath: './share.js',
      routes: routes.map((route) => `/share/routes/${route.route_id}`),
      write,
    },
    repo,
  );
}
