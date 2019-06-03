const Gherkin = require('./node_modules/gherkin/');
const factory = require('../../src/factory');

module.exports = factory(Gherkin, {
  cwd: __dirname,
});
