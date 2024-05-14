import getSvagEslintBaseConfigs from './base.js'
import nodePlugin from 'eslint-plugin-node'
import globals from 'globals'

/** @type {(props?: {ignores?: string[]}) => import('eslint').Linter.FlatConfig[]}*/
export default (props = {}) => [
  ...getSvagEslintBaseConfigs(props),
  {
    plugins: {
      node: nodePlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
