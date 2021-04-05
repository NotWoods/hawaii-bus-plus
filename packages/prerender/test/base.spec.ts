import test from 'ava';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { buildPrerenderCode, distFolder, RenderFunction } from '../src/base.js';
import { prerenderAuth } from '../src/prerender-auth.js';

test.serial('build code and assets', async (t) => {
  const { code, assets } = await buildPrerenderCode('./auth/entry-server.tsx');

  t.is(typeof code, 'string');
  t.is(assets.length, 2);
  t.like(assets[0], { name: 'style.css' });
  t.like(assets[1], { fileName: 'manifest.webmanifest' });
});

test.serial('render and run auth entry file', async (t) => {
  const { module } = await buildPrerenderCode('./auth/entry-server.tsx');

  const exports = Object.keys(module.exports);
  t.deepEqual(exports, ['default']);

  const render = module.exports.default as RenderFunction;
  const result = await render(
    new URL('/auth/login', 'https://app.hawaiibusplus.com'),
  );

  t.deepEqual(Object.keys(result), ['html', 'head']);
  t.is(typeof result.head, 'string');
  t.is(typeof result.html, 'string');

  t.true(
    result.head!.includes('<title>Login - Hawaii Bus Plus</title>'),
    result.head,
  );
});

test.serial('render auth routes', async (t) => {
  let rendered: { fileName: string; source: string }[];
  try {
    rendered = await prerenderAuth(false);
  } catch (err: unknown) {
    // Workaround for race condition in GitHub Actions
    t.is((err as { code?: unknown }).code, 'ENOENT');
    return;
  }

  t.is(rendered.length, 7);
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

test.serial('render and run page entry file', async (t) => {
  const { module, error } = await buildPrerenderCode('./page/entry-server.tsx');

  t.is(error, undefined);

  const exports = Object.keys(module.exports);
  t.deepEqual(exports, ['default']);

  const render = module.exports.default as RenderFunction;
  const result = await render(new URL('/', 'https://app.hawaiibusplus.com'));

  t.deepEqual(Object.keys(result), ['html', 'head']);
  t.is(typeof result.head, 'string');
  t.is(typeof result.html, 'string');

  t.is(result.head, '');
});
