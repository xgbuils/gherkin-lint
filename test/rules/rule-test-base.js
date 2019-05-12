const assert = require('chai').assert;
const Gherkin = require('gherkin');
const fs = require('fs');
const RulesParser = require('../../src/rules-parser');
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
  const result = new RulesParser(rawRules).parse(configSet);
  if (result.isSuccess()) {
    const rules = result.getSuccesses();
    return new ConfigurableLinter(noConfigurableLinter).lint(file, rules);
  }
  return result.getFailures();
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

const createExpectedError = (messageTemplate) => (error) => {
  const messageError = error.messageElements
    ? {message: messageTemplate(error.messageElements)}
    : {};
  const expectedError = Object.assign({
    type: 'rule',
  }, error, messageError);
  delete expectedError['messageElements'];
  return expectedError;
};

function createRuleTest(rule, messageTemplate) {
  return function runTest(featureFile, configuration, expected) {
    const expectedErrors = Array.isArray(expected)
      ? expected.map(createExpectedError(messageTemplate))
      : createExpectedError(messageTemplate)(expected);
    const file = createFile(featureFile);
    const errors = lintFile(rule, configuration, file);
    assert.deepEqual(errors, expectedErrors);
  };
}

module.exports = {
  createRuleTest: createRuleTest,
};
