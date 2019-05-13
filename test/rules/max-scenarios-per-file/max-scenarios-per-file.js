const ruleName = 'max-scenarios-per-file';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/max-scenarios-per-file.js');
const runTest = ruleTestBase.createRuleTest(rule);
const message = ({variable}) => `Number of scenarios exceeds maximum: ${variable}/10`;

describe('Max Scenarios per File rule', () => {
  it('detects an error when property is not "maxScenarios"', () => {
    runTest('max-scenarios-per-file/CorrectNumber.feature', {
      'foobar': 20,
    }, {
      type: 'config-error',
      message: 'Error(s) in configuration file:',
      errors: [{
        type: 'config-rule-error',
        rule: ruleName,
        message: 'The rule does not have the specified configuration option "foobar"',
      }],
    });
  });

  it('does not raise errors when the default configuration is used and there are correct number of scenarios', () => {
    runTest('max-scenarios-per-file/CorrectNumber.feature', {maxScenarios: 10}, []);
    runTest('max-scenarios-per-file/CorrectNumberExamples.feature', {maxScenarios: 10}, []);
    runTest('max-scenarios-per-file/CorrectNumberMixed.feature', {maxScenarios: 10}, []);
  });

  context('Too many scenarios', () => {
    it('detects errors when a feature file has too many scenarios', () => {
      runTest('max-scenarios-per-file/TooManyScenarios.feature', {
        maxScenarios: 10,
      }, [{
        message: message({variable: 11}),
        rule: ruleName,
        location: {
          line: 0,
          column: 1,
        },
      }]);
    });
  });

  context('Too many examples on Scenario Outline', () => {
    it('detects errors when a feature file has too many scenarios', () => {
      runTest('max-scenarios-per-file/TooManyExamples.feature', {
        maxScenarios: 10,
      }, [{
        message: message({variable: 11}),
        rule: ruleName,
        location: {
          line: 0,
          column: 1,
        },
      }]);
    });
  });
});
