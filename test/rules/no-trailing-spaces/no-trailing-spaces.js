const ruleName = 'no-trailing-spaces';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-trailing-spaces.js');
const TRAILING_SPACES = 'Trailing spaces are not allowed';
const runTest = ruleTestBase.createRuleTest(rule, () =>
  'Trailing spaces are not allowed');

describe('No Trailing Spaces Rule', () => {
  it('doesn\'t raise errors when there are no violations', () => {
    runTest('no-trailing-spaces/NoViolations.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', () => {
    runTest('no-trailing-spaces/Violations.feature', {}, [{
      location: {
        line: 3,
        column: 12,
      },
      rule: ruleName,
      message: TRAILING_SPACES,
    }, {
      location: {
        line: 12,
        column: 33,
      },
      rule: ruleName,
      message: TRAILING_SPACES,
    }, {
      location: {
        line: 14,
        column: 10,
      },
      rule: ruleName,
      message: TRAILING_SPACES,
    }]);
  });
});
