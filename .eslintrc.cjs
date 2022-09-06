// @ts-check
/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.cjs', '.mjs'],
  },
  plugins: ['@typescript-eslint', 'ava'],
  extends: [
    'eslint:recommended',
    'preact',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/style',
    'plugin:ava/recommended',
    'prettier',
  ],
  ignorePatterns: ['**/*.d.ts'],
  rules: {
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
    '@typescript-eslint/explicit-module-boundary-types': 'off',
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
    '@typescript-eslint/no-implicit-any-catch': 'error',
    '@typescript-eslint/no-namespace': [
      'error',
      {
        allowDeclarations: true,
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'off',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    'ava/no-ignored-test-files': [
      'error',
      {
        extensions: ['ts', 'tsx'],
      },
    ],
    'jest/prefer-todo': 'error',
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
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: false },
        ],
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/non-nullable-type-assertion-style': 'error',
        '@typescript-eslint/prefer-includes': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        '@typescript-eslint/unbound-method': 'off',
      },
    },
    {
      files: ['packages/*/test/**/*.{ts,tsx}'],
      rules: {
        'jest/expect-expect': 'off',
        'jest/no-done-callback': 'off',
        'jest/no-test-callback': 'off',
        'jest/no-export': 'off',
        'jest/valid-title': 'off',
      },
    },
    {
      files: ['**/*.cjs', '**/*.mjs'],
      parserOptions: {
        project: [],
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
module.exports = config;
