const ruleName = 'no-unused-variables';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-unused-variables.js');

describe('No unused variables rule', function() {
  it('doesn\'t raise errors when there are no violations', function() {
    const runTest = ruleTestBase.createRuleTest(rule, '');
    runTest('no-unused-variables/NoViolations.feature', {}, []);
  });

  it('detects unused scenario variables', function() {
    const runTest = ruleTestBase.createRuleTest(rule, ({variable}) =>
      `Step variable "${variable}" does not exist the in examples table`);

    runTest('no-unused-variables/UnusedStepVariables.feature', {}, [{
      location: {
        line: 5,
        column: 24,
      },
      rule: ruleName,
      messageElements: {variable: 'b'},
    },
    {
      location: {
        line: 11,
        column: 108,
      },
      rule: ruleName,
      messageElements: {variable: 'b'},
    },
    {
      location: {
        line: 23,
        column: 8,
      },
      rule: ruleName,
      messageElements: {variable: 'b'},
    },
    {
      location: {
        line: 38,
        column: 10,
      },
      rule: ruleName,
      messageElements: {variable: 'b'},
    }]);
  });

  it('detects unused variables in the examples table', function() {
    const runTest = ruleTestBase.createRuleTest(rule, ({variable}) =>
      `Examples table variable "${variable}" is not used in any step`);

    runTest('no-unused-variables/UnusedExampleVariables.feature', {}, [{
      location: {
        line: 7,
        column: 11,
      },
      rule: ruleName,
      messageElements: {variable: 'b'},
    }, {
      location: {
        line: 19,
        column: 7,
      },
      rule: ruleName,
      messageElements: {variable: 'b'},
    },
    {
      location: {
        line: 28,
        column: 11,
      },
      rule: ruleName,
      messageElements: {variable: 'b'},
    },
    {
      location: {
        line: 42,
        column: 7,
      },
      rule: ruleName,
      messageElements: {variable: 'b'},
    },
    {
      location: {
        line: 54,
        column: 11,
      },
      rule: ruleName,
      messageElements: {variable: 'b'},
    }]);
  });
});
