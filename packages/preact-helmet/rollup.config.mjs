// @ts-check
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { posix as path } from 'path';
import { fileURLToPath } from 'url';

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
        {
          find: 'prop-types',
          replacement: '',
          customResolver(source) {
            if (!source) {
              return path.resolve(
                fileURLToPath(import.meta.url),
                '../prop-types.cjs',
              );
            }
          },
        },
      ],
    }),
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
  ],
  external: ['preact', 'preact/compat'],
};

export default config;
