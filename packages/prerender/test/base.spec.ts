import test from 'ava';
import { fileURLToPath } from 'url';
import { buildSsrVite, clientFolder } from '../src/base.js';

test.before(() => {
  process.chdir(fileURLToPath(clientFolder));
});

test.serial('build code and assets', async (t) => {
  const { code, assets } = await buildSsrVite('./auth/entry-server.tsx');

  t.is(typeof code, 'string');
  t.is(assets.length, 1);
  t.like(assets[0], { name: 'style.css' });
});

test.serial('render and run server entry file', async (t) => {
  const { module } = await buildSsrVite('./auth/entry-server.tsx');

  const exports = Object.keys(module.exports);
  t.deepEqual(exports, ['default']);

  const render = module.exports.default as (
    url: URL
  ) => { html: string; head: string };
  const result = render(
    new URL('/auth/login', 'https://app.hawaiibusplus.com')
  );

  t.deepEqual(Object.keys(result), ['html', 'head']);
  t.is(result.head, '{{ .Head }}');
  t.is(typeof result.html, 'string');
});
