// @ts-check
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/helmet.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/helmet.mjs',
      format: 'es',
    },
  ],
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },
      ],
    }),
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
  ],
};

export default config;
