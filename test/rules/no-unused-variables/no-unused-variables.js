const ruleName = 'no-unused-variables';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-unused-variables.js');
const undeclaredVarMessage = ({variable}) =>
  `Step variable "${variable}" does not exist the in examples table`;
const unusedVarMessage = ({variable}) =>
  `Examples table variable "${variable}" is not used in any step`;
describe('No unused variables rule', () => {
  it('doesn\'t raise errors when there are no violations', () => {
    const runTest = ruleTestBase.createRuleTest(rule);
    return runTest('no-unused-variables/NoViolations.feature', {}, []);
  });

  it('detects unused scenario variables', () => {
    const runTest = ruleTestBase.createRuleTest(rule);

    return runTest('no-unused-variables/UnusedStepVariables.feature', {}, [{
      location: {
        line: 5,
        column: 24,
      },
      rule: ruleName,
      message: undeclaredVarMessage({variable: 'b'}),
    },
    {
      location: {
        line: 11,
        column: 108,
      },
      rule: ruleName,
      message: undeclaredVarMessage({variable: 'b'}),
    },
    {
      location: {
        line: 23,
        column: 8,
      },
      rule: ruleName,
      message: undeclaredVarMessage({variable: 'b'}),
    },
    {
      location: {
        line: 38,
        column: 10,
      },
      rule: ruleName,
      message: undeclaredVarMessage({variable: 'b'}),
    },
    {
      location: {
        line: 39,
        column: 16,
      },
      message: 'Step variable "b" does not exist the in examples table',
      rule: ruleName,
    }]);
  });

  it('detects unused variables in the examples table', () => {
    const runTest = ruleTestBase.createRuleTest(rule);

    return runTest('no-unused-variables/UnusedExampleVariables.feature', {}, [{
      location: {
        line: 7,
        column: 11,
      },
      rule: ruleName,
      message: unusedVarMessage({variable: 'b'}),
    }, {
      location: {
        line: 19,
        column: 7,
      },
      rule: ruleName,
      message: unusedVarMessage({variable: 'b'}),
    },
    {
      location: {
        line: 28,
        column: 11,
      },
      rule: ruleName,
      message: unusedVarMessage({variable: 'b'}),
    },
    {
      location: {
        line: 38,
        column: 11,
      },
      rule: ruleName,
      message: unusedVarMessage({variable: 'b'}),
    },
    {
      location: {
        line: 42,
        column: 7,
      },
      rule: ruleName,
      message: unusedVarMessage({variable: 'b'}),
    },
    {
      location: {
        line: 54,
        column: 11,
      },
      rule: ruleName,
      message: unusedVarMessage({variable: 'b'}),
    }]);
  });
});
