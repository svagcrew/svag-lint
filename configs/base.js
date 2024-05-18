import typescriptEslintParser from '@typescript-eslint/parser'
import eslintConfigCanonicalBrowser from 'eslint-config-canonical/configurations/browser.js'
import eslintConfigCanonicalCanonical from 'eslint-config-canonical/configurations/canonical.js'
import eslintConfigCanonicalJest from 'eslint-config-canonical/configurations/jest.js'
import eslintConfigCanonicalJsdoc from 'eslint-config-canonical/configurations/jsdoc.js'
import eslintConfigCanonicalJsx from 'eslint-config-canonical/configurations/jsx-a11y.js'
import eslintConfigCanonicalLodash from 'eslint-config-canonical/configurations/lodash.js'
import eslintConfigCanonicalModule from 'eslint-config-canonical/configurations/module.js'
import eslintConfigCanonicalNode from 'eslint-config-canonical/configurations/node.js'
import eslintConfigCanonicalReact from 'eslint-config-canonical/configurations/react.js'
import eslintConfigCanonicalRegexp from 'eslint-config-canonical/configurations/regexp.js'
import eslintConfigCanonicalTs1 from 'eslint-config-canonical/configurations/typescript.js'
import eslintConfigCanonicalTs2 from 'eslint-config-canonical/configurations/typescript-compatibility.js'
import eslintConfigCanonicalTs3 from 'eslint-config-canonical/configurations/typescript-type-checking.js'
import eslintConfigCanonicalZod from 'eslint-config-canonical/configurations/zod.js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginJest from 'eslint-plugin-jest'
import tseslint from 'typescript-eslint'

// TODO: add react-refresh/only-export-components

const check = (condition, subject) => {
  if (condition) {
    return [subject]
  } else {
    return []
  }
}

const omit = (object, keys) => {
  const result = {}
  for (const key in object) {
    if (!keys.includes(key)) {
      result[key] = object[key]
    }
  }
  return result
}

/** @type {(props?: {ignores?: string[]; jest?: boolean}) => import('eslint').Linter.FlatConfig[]} */
export default (props = {}) => [
  {
    ignores: props.ignores !== undefined ? props.ignores : ['dist', 'volumes', 'node_modules'],
  },
  eslintConfigCanonicalCanonical.recommended,
  eslintConfigCanonicalJsdoc.recommended,
  eslintConfigCanonicalBrowser.recommended,
  ...check(props.jest, { ...eslintConfigCanonicalJest.recommended, plugins: { jest: eslintPluginJest } }),
  {
    ...omit(eslintConfigCanonicalJsx.recommended, ['parserOptions']),
    languageOptions: {
      parserOptions: eslintConfigCanonicalJsx.recommended.parserOptions,
    },
  },
  eslintConfigCanonicalLodash.recommended,
  eslintConfigCanonicalModule.recommended,
  eslintConfigCanonicalNode.recommended,
  eslintConfigCanonicalReact.recommended,
  eslintConfigCanonicalRegexp.recommended,
  eslintConfigCanonicalZod.recommended,
  ...tseslint.config(...tseslint.configs.recommended, {
    ...eslintConfigCanonicalTs1.recommended,
    plugins: {
      ...omit(eslintConfigCanonicalTs1.recommended.plugins, ['@typescript-eslint']),
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      ...eslintConfigCanonicalTs1.recommended.rules,
      ...eslintConfigCanonicalTs2.recommended.rules,
      ...eslintConfigCanonicalTs3.recommended.rules,
      '@typescript-eslint/no-floating-promises': ['error'],
    },
  }),
  eslintConfigPrettier,
  {
    rules: {
      'no-negated-condition': 'off',
      'canonical/sort-keys': 'off',
      'prettier/prettier': 'off',
      'array-bracket-newline': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'no-implicit-coercion': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'canonical/id-match': 'off',
      'padding-line-between-statements': 'off',
      '@typescript-eslint/padding-line-between-statements': 'off',
      'canonical/prefer-inline-type-import': 'off',
      'typescript-sort-keys/interface': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'require-unicode-regexp': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'no-warning-comments': 'off',
      'id-length': 'off',
      'no-param-reassign': 'off',
      'no-promise-executor-return': 'off',
      complexity: 'off',
      'arrow-body-style': 'off',
      'n/no-extraneous-import': 'off',
      'canonical/import-specifier-newline': 'off',
      'canonical/destructuring-property-newline': 'off',
      'line-comment-position': 'off',
      'no-inline-comments': 'off',
      'lodash/prefer-lodash-chain': 'off',
      'lodash/prefer-lodash-typecheck': 'off',
      'unicorn/prefer-node-protocol': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      'zod/require-strict': 'off',
      '@typescript-eslint/prefer-regexp-exec': 'off',
      'unicorn/text-encoding-identifier-case': 'off',
      'unicorn/prefer-json-parse-buffer': 'off',
      'canonical/filename-match-exported': 'off',
      'react/jsx-sort-props': 'off',
      'jsx-a11y/anchor-has-content': 'off',
      'unicorn/prefer-query-selector': 'off',
      'jsdoc/multiline-blocks': 'off',
      'unicorn/no-lonely-if': 'off',
      'no-lonely-if': 'off',
      'n/callback-return': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/dot-notation': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'lodash/matches-prop-shorthand': 'off',
      'unicorn/no-array-reduce': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/prefer-reduce-type-parameter': 'off',
      'unicorn/prefer-number-properties': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'unicorn/better-regex': 'off',
      'canonical/export-specifier-newline': 'off',
    },
  },
]
