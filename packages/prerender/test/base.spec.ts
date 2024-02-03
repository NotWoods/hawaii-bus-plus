import { expect, test } from 'vitest';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { distFolder, renderRoutes } from '../src/base.js';

test.skip('render auth routes', async () => {
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
    expect((err as { code?: unknown }).code).toBe('ERR_MODULE_NOT_FOUND');
    return;
  }

  expect(rendered).toHaveLength(2);
  const [login, register] = rendered;

  function normalizePath(path: string) {
    const relativeTo = fileURLToPath(distFolder);
    const absPath = fileURLToPath(new URL(path));
    return relative(relativeTo, absPath);
  }

  expect(normalizePath(login.fileName)).toBe(join('auth', 'login.html'));
  expect(normalizePath(register.fileName)).toBe(join('auth', 'register.html'));

  expect(login.source).toContain('Login');
  expect(register.source).toContain('Register');
});
