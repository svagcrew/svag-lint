const getSvagEslintNodeConfigs = require('./configs/node')
const globals = require('globals')

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  ...getSvagEslintNodeConfigs(),
  {
    ignores: ['!configs', '!configs/*'],
  },
  {
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
    languageOptions: {
      globals: {
        ...globals.node,
      }
    }
  },
]
