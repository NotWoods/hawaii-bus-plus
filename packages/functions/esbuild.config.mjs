import { build } from 'esbuild';

/**
 * @param {string} input
 */
async function defineConfig(input, output = input) {
  await build({
    entryPoints: [`src/${input}.js`],
    outfile: `../../dist/functions/${output}.js`,
    bundle: true,
    sourcemap: true,
    platform: 'node',
    target: 'node14',
    format: 'cjs',
    external: ['./done.html'],
  });
}

await Promise.all([
  defineConfig('api', 'api/index'),
  defineConfig('auth/index'),
  defineConfig('billing'),
  defineConfig('edituser'),
  defineConfig('logout'),
  defineConfig('payment'),
  defineConfig('stripe-webhook'),
  defineConfig('userdata'),
]);
