import getSvagEslintBaseConfigs from './base.js'
import globals from 'globals'

/** @type {(props?: {ignores?: string[]}) => import('eslint').Linter.FlatConfig[]}*/
export default (props = {}) => [
  ...getSvagEslintBaseConfigs(props),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
]
