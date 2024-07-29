// @ts-check
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import vitest from 'eslint-plugin-vitest';
import globals from 'globals';
import { dirname } from 'node:path';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    name: 'global-ignores',
    ignores: ['dist', '**/*.d.ts', '**/*.js'],
  },
  { ...eslint.configs.recommended, name: 'eslint/recommended' },
  ...tseslint.configs.recommended,
  { ...prettier, name: 'prettier' },
  { ...react.configs.flat['recommended'], name: 'react/recommended' },
  { ...react.configs.flat['jsx-runtime'], name: 'react/jsx-runtime' },
  {
    name: 'react-hooks/recommended',
    plugins: {
      'react-hooks': reactHooks,
    },
    rules:
      /** @type {import('typescript-eslint').ConfigWithExtends['rules']} */ (
        reactHooks.configs.recommended.rules
      ),
  },
  {
    name: 'main',
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    settings: {
      react: {
        pragma: 'h',
        version: '16.0',
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
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/self-closing-comp': 'error',
      'react/prefer-es6-class': 'error',
      'react/prefer-stateless-function': 'warn',
      'react/no-danger': 'warn',
      // Legacy APIs not supported in Preact:
      'react/no-did-mount-set-state': 'error',
      'react/no-did-update-set-state': 'error',

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
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: dirname(import.meta.url),
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
    name: 'config-files',
    files: ['**/*.cjs', '**/*.mjs'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
);
