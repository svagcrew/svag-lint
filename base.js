const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = tseslint.config(
  {
    ignores: ["**", "*", "!src/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);

