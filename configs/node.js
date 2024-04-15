const svagEslintBaseConfigs = require('./base');
const nodePlugin = require('eslint-plugin-node');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  ...svagEslintBaseConfigs,
  {
    plugins: {
      node: nodePlugin,
    }
  },
];

