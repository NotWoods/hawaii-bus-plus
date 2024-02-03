// @ts-check
/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // @ts-expect-error nodejs types haven't been loaded in here
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.cjs', '.mjs'],
  },
  plugins: ['@typescript-eslint', 'vitest', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vitest/recommended',
    'prettier',
  ],
  settings: {
    react: {
      pragma: 'h',
      version: '16.0',
    },
  },
  ignorePatterns: ['**/*.d.ts'],
  rules: {
    /**
     * Preact / JSX rules
     */
    'react/no-deprecated': 'error',
    'react/display-name': ['warn', { ignoreTranspilerName: false }],
    'react/jsx-no-bind': [
      'warn',
      {
        ignoreRefs: true,
        allowFunctions: true,
        allowArrowFunctions: true,
      },
    ],
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
    'react/jsx-uses-react': 'error', // debatable
    'react/jsx-uses-vars': 'error',
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/self-closing-comp': 'error',
    'react/prefer-es6-class': 'error',
    'react/prefer-stateless-function': 'warn',
    'react/require-render-return': 'error',
    'react/no-danger': 'warn',
    // Legacy APIs not supported in Preact:
    'react/no-did-mount-set-state': 'error',
    'react/no-did-update-set-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-string-refs': 'error',

    /**
     * Hooks
     */
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    /**
     * General JavaScript error avoidance
     */
    'no-caller': 'error',
    'no-delete-var': 'error',
    'no-duplicate-imports': 'error',
    'no-empty-pattern': 'off',
    'no-empty': 'off',
    'no-extra-parens': 'off',
    'no-iterator': 'error',
    'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
    'no-multi-str': 'warn',
    'no-new-wrappers': 'error',
    'no-proto': 'error',
    'no-redeclare': 'error',
    'no-shadow-restricted-names': 'error',
    'no-shadow': 0,
    'no-spaced-func': 'error',
    'no-this-before-super': 'error',
    'no-undef-init': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-call': 'warn',
    'no-useless-computed-key': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-escape': 'warn',
    'no-useless-rename': 'warn',
    'no-var': 'error',
    'no-with': 'error',

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
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'off',
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
    'no-undef': 'off',
  },
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-type-checked',
      ],
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
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
      files: ['packages/*/test/**/*.{ts,tsx}'],
      rules: {
        'vitest/expect-expect': 'off',
        'vitest/no-done-callback': 'off',
        'vitest/valid-title': 'off',
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
