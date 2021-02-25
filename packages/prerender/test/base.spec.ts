import test from 'ava';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import {
  buildPrerenderCode,
  distFolder,
  RenderFunction,
  renderRoutes,
} from '../src/base.js';

test.serial('build code and assets', async (t) => {
  const { code, assets } = await buildPrerenderCode('./auth/entry-server.tsx');

  t.is(typeof code, 'string');
  t.is(assets.length, 1);
  t.like(assets[0], { name: 'style.css' });
});

test.serial('render and run server entry file', async (t) => {
  const { module } = await buildPrerenderCode('./auth/entry-server.tsx');

  const exports = Object.keys(module.exports);
  t.deepEqual(exports, ['default']);

  const render = module.exports.default as RenderFunction;
  const result = await render(
    new URL('/auth/login', 'https://app.hawaiibusplus.com')
  );

  t.deepEqual(Object.keys(result), ['html', 'head']);
  t.is(result.head, '');
  t.is(typeof result.html, 'string');
});

test.serial('render routes', async (t) => {
  const rendered = await renderRoutes({
    templatePath: './auth/index.html',
    serverEntryPath: './auth/entry-server.tsx',
    routes: ['/auth/login', '/auth/register'],
    write: false,
  });

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
