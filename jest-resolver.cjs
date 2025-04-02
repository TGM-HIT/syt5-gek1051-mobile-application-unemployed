// jest-resolver.cjs
const resolver = require('enhanced-resolve');

module.exports = resolver.create.sync({
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  mainFields: ['main'],
});
