// @ts-check
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/** @type {import('rollup').RollupOptions[]} */
const allConfigs = [];

/**
 * @param {string} input
 */
function defineConfig(input, output = input) {
  allConfigs.push({
    input: `src/${input}.js`,
    output: {
      file: `../../dist/functions/${output}.js`,
      format: 'cjs',
    },
    plugins: [nodeResolve(), commonjs()],
  });
}

defineConfig('api', 'api/index');
defineConfig('auth', 'auth/index');
defineConfig('edituser');
defineConfig('userdata');
defineConfig('logout');
defineConfig('identity-validate');

export default allConfigs;
