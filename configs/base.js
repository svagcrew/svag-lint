import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

/** @type {(props?: {ignores?: string[]}) => import('eslint').Linter.FlatConfig[]}*/
export default (props = {}) =>
  tseslint.config(
    {
      ignores: props.ignores !== undefined ? props.ignores : ['dist', 'volumes', 'node_modules'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
      files: ['*.@(js|ts|js|ts)'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      rules: {
        'no-console': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    }
  )
