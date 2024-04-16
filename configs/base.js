const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

/** @type {(props?: {ignores?: string[]}) => import('eslint').Linter.FlatConfig[]}*/
module.exports = (props = {}) =>
  tseslint.config(
    {
      ignores: props.ignores !== undefined ? props.ignores : ['dist', 'volumes', 'node_modules'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
      files: ['*.@(js|ts)'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      rules: {
        'no-console': 'error',
      },
    }
  )
