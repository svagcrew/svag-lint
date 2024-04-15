const getSvagEslintBaseConfigs = require('./base')
const nodePlugin = require('eslint-plugin-node')

/** @type {() => import('eslint').Linter.FlatConfig[]} */
module.exports = () => [
  ...getSvagEslintBaseConfigs(),
  {
    plugins: {
      node: nodePlugin,
    },
  },
]
