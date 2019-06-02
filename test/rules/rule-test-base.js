const assert = require('chai').assert;
const Gherkin = require('gherkin');
const fs = require('fs');
const RulesParser = require('../../src/rules-provider/rules-parser');
const ParserAdapter = require('../../src/parser-adapter');
const NoConfigurableLinter = require('../../src/linter/no-configurable-linter');
const ConfigurableLinter = require('../../src/linter/configurable-linter');

const lintFile = (rule, config, file) => {
  const parser = ParserAdapter(Gherkin);
  const noConfigurableLinter = new NoConfigurableLinter(parser);
  const ruleName = rule.name;
  const rawRules = {};
  const configSet = {};
  rawRules[ruleName] = rule;
  configSet[ruleName] = ['on', config];
  return new RulesParser(rawRules).parse(configSet).then(
    (rules) => new ConfigurableLinter(noConfigurableLinter).lint(file, rules),
    (failures) => (failures)
  );
};

const createFile = (fileName) => {
  const path = `test/rules/${fileName}`;
  const content = fs.readFileSync(path, 'utf-8');
  return {
    name: path,
    content,
    lines: content.split(/\r\n|\r|\n/),
  };
};

const createExpectedError = (error) => {
  const expectedError = Object.assign({
    type: 'rule',
  }, error);
  delete expectedError['messageElements'];
  return expectedError;
};

const createRuleTest = (rule) => {
  return function runTest(featureFile, configuration, expected) {
    const expectedErrors = Array.isArray(expected)
      ? expected.map(createExpectedError)
      : createExpectedError(expected);
    const file = createFile(featureFile);
    return lintFile(rule, configuration, file).then((errors) => {
      assert.deepEqual(errors, expectedErrors);
    });
  };
};

module.exports = {
  createRuleTest,
};
