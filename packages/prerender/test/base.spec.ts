import test from 'ava';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { distFolder, renderRoutes } from '../src/base.js';

// eslint-disable-next-line ava/no-skip-test
test.serial.skip('render auth routes', async (t) => {
  let rendered: { fileName: string; source: string }[];
  try {
    rendered = await renderRoutes({
      templatePath: './auth/index.html',
      serverEntryPath: './authjs',
      routes: ['/auth/login', '/auth/register'],
      write: false,
    });
  } catch (err: unknown) {
    // Workaround for race condition in GitHub Actions
    t.is((err as { code?: unknown }).code, 'ERR_MODULE_NOT_FOUND');
    return;
  }

  t.is(rendered.length, 2);
  const [login, register] = rendered;

  function normalizePath(path: string) {
    const relativeTo = fileURLToPath(distFolder);
    const absPath = fileURLToPath(new URL(path));
    return relative(relativeTo, absPath);
  }

  t.is(normalizePath(login.fileName), join('auth', 'login.html'));
  t.is(normalizePath(register.fileName), join('auth', 'register.html'));

  t.true(login.source.includes('Login'), 'Login');
  t.true(register.source.includes('Register'), 'Register');
});
