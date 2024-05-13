const getSvagEslintBaseConfigs = require('./base')
const globals = require('globals')

/** @type {(props?: {ignores?: string[]}) => import('eslint').Linter.FlatConfig[]}*/
module.exports = (props = {}) => [
  ...getSvagEslintBaseConfigs(props),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
]
