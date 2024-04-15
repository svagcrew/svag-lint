const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = tseslint.config(
  {
    ignores: ["**", "*", "!src/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      // log forbidden, info, warn, error, debug, trace allowed
      // 'no-console': ['error', { allow: ['warn', 'error', 'info', 'debug', 'trace'] }],
      'no-console': 'error'
    }
  }
);

