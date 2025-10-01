import eslint from '@eslint/js';
import preact from '@notwoods/eslint-config-preact';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';
import { join } from 'node:path';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      '**/*.d.ts',
      '**/*.js',
      'packages/edge-functions/**/*.ts',
    ],
  },
  { ...eslint.configs.recommended, name: 'eslint/recommended' },
  ...tseslint.configs.recommended,
  { ...prettier, name: 'prettier' },
  ...preact.configs.recommended,
  { ...react.configs.flat['jsx-runtime'], name: 'react/jsx-runtime' },
  reactHooks.configs['recommended-latest'],
  {
    name: 'main',
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      /**
       * Preact / JSX rules
       */
      'react/jsx-no-bind': [
        'warn',
        {
          ignoreRefs: true,
          allowFunctions: true,
          allowArrowFunctions: true,
        },
      ],
      'react/self-closing-comp': 'error',
      'react/prefer-stateless-function': 'warn',
      'react/no-danger': 'warn',
      'react/no-unknown-property': 'off',

      /**
       * General JavaScript error avoidance
       */
      'no-caller': 'error',
      'no-duplicate-imports': 'error',
      'no-empty': 'off',
      'no-iterator': 'error',
      'no-multi-str': 'warn',
      'no-new-wrappers': 'error',
      'no-proto': 'error',
      'no-undef-init': 'error',
      'no-unneeded-ternary': 'error',
      'no-useless-call': 'warn',
      'no-useless-computed-key': 'warn',
      'no-useless-concat': 'warn',
      'no-useless-constructor': 'warn',
      'no-useless-rename': 'warn',
      'no-var': 'error',

      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array',
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
        },
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: [
            'arrowFunctions',
            'methods',
            'private-constructors',
            'protected-constructors',
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': [
        'error',
        {
          allowDeclarations: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: true,
        },
      ],
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
        },
      ],
      'no-else-return': 'off',
    },
  },
  {
    name: 'type-checked',
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['packages/*/.storybook/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...tseslint.configs.recommendedTypeChecked.at(-1)?.rules,
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    name: 'browser',
    files: ['packages/client/**/*'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    name: 'workers',
    files: ['packages/workers/**/*'],
    languageOptions: {
      globals: {
        ...globals.worker,
      },
    },
  },
  {
    name: 'tests',
    ...vitest.configs.recommended,
    files: ['packages/*/test/**/*.{ts,tsx}'],
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/expect-expect': 'off',
    },
  },
  {
    name: 'tests/workers',
    files: ['packages/workers/**/*.spec.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: join(
          import.meta.dirname,
          './packages/workers/tsconfig.test.json',
        ),
      },
    },
  },
  {
    name: 'config-files',
    files: ['**/*.cjs', '**/*.mjs'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
