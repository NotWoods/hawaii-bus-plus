// @ts-check
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

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
    plugins: [nodeResolve({ preferBuiltins: true }), commonjs(), json()],
  });
}

defineConfig('api', 'api/index');
defineConfig('auth/index');
defineConfig('billing');
defineConfig('edituser');
defineConfig('userdata');
defineConfig('logout');
defineConfig('identity-signup');
defineConfig('stripe-webhook');

export default allConfigs;
