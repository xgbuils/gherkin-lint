const ruleName = 'no-multiple-empty-lines';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-multiple-empty-lines');
const NO_MULTIPLE_EMPTY_LINES = 'Multiple empty lines are not allowed';
const runTest = ruleTestBase.createRuleTest(rule);

describe('No multiple empty lines', () => {
  it('doesn\'t raise errors when there are no violations', () => {
    return runTest('no-multiple-empty-lines/NoViolations.feature', {}, []);
  });

  it('detects errors there are multiple empty lines', () => {
    return runTest('no-multiple-empty-lines/Violations.feature', {}, [{
      location: {
        line: 2,
        column: 1,
      },
      rule: ruleName,
      message: NO_MULTIPLE_EMPTY_LINES,
    }, {
      location: {
        line: 9,
        column: 1,
      },
      rule: ruleName,
      message: NO_MULTIPLE_EMPTY_LINES,
    }, {
      location: {
        line: 10,
        column: 1,
      },
      rule: ruleName,
      message: NO_MULTIPLE_EMPTY_LINES,
    }, {
      location: {
        line: 22,
        column: 1,
      },
      rule: ruleName,
      message: NO_MULTIPLE_EMPTY_LINES,
    }]);
  });
});
