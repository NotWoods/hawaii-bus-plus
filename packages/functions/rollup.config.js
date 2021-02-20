// @ts-check
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/** @type {import('rollup').RollupOptions[]} */
const allConfigs = [];

/**
 * @param {string} input
 */
function defineConfig(input) {
  allConfigs.push({
    input: `src/${input}.js`,
    output: {
      file: `../../dist/functions/${input}.js`,
      format: 'cjs',
    },
    plugins: [nodeResolve(), commonjs()],
  });
}

defineConfig('api');
defineConfig('auth');
defineConfig('edituser');
defineConfig('userdata');

export default allConfigs;
