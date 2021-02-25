import { renderRoutes } from './base';

void renderRoutes({
  templatePath: './auth/index.html',
  serverEntryPath: './auth/entry-server.tsx',
  routes: [
    '/auth/login',
    '/auth/register',
    '/auth/forgot',
    '/auth/recover',
    '/auth/invited',
    '/auth/done',
    '/auth/registered',
  ],
});
