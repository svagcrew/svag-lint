import getSvagEslintNodeConfigs from './configs/node.js'
/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...getSvagEslintNodeConfigs(),
  {
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
]
