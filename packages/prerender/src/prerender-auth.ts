import { renderRoutes } from './base.js';

export async function prerenderAuth(write: boolean) {
  return await renderRoutes({
    templatePath: './auth/index.html',
    serverEntryPath: './auth.js',
    routes: [
      '/404',
      '/auth/login',
      '/auth/register',
      '/auth/forgot',
      '/auth/recover',
      '/auth/invited',
      '/auth/done',
      '/auth/registered',
    ],
    write,
  });
}
