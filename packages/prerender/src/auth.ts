import { renderRoutes } from './base';

void renderRoutes('/auth/index.html', '', [
  '/auth/login',
  '/auth/register',
  '/auth/forgot',
  '/auth/recover',
  '/auth/invited',
  '/auth/done',
  '/auth/registered',
]);
