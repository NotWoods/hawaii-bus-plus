import { build } from 'esbuild';

/**
 * @param {string} input
 */
async function defineConfig(input, output = input) {
  await build({
    entryPoints: [`src/${input}.ts`],
    outfile: `../../dist/functions/${output}.js`,
    bundle: true,
    sourcemap: true,
    platform: 'node',
    target: 'node14',
    format: 'cjs',
    loader: {
      '.html': 'text',
    },
  });
}

await Promise.all([
  defineConfig('api', 'api/index'),
  defineConfig('auth/index'),
  defineConfig('billing'),
  defineConfig('edituser'),
  defineConfig('greenroad-webhook/index'),
  defineConfig('logout'),
  defineConfig('payment'),
  defineConfig('stripe-webhook'),
  defineConfig('userdata'),
]);
