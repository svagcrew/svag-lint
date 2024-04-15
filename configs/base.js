const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = tseslint.config(
  {
    ignores: ["**", "*", "!src/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // log forbidden, info, warn, error, debug, trace allowed
      // 'no-console': ['error', { allow: ['warn', 'error', 'info', 'debug', 'trace'] }],
      'no-console': 'error'
    }
  }
);

