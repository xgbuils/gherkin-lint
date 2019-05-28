const ruleName = 'no-unnamed-features';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-unnamed-features.js');
const MISSING_FEATURE_NAME = 'Missing Feature name';
const runTest = ruleTestBase.createRuleTest(rule, () => 'Missing Feature name');

describe('No Unnamed Features Rule', () => {
  it('does not raise errors when there are no violations', () => {
    return runTest('no-unnamed-features/NoViolations.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', () => {
    return runTest('no-unnamed-features/Violations.feature', {}, [{
      location: {
        line: 3,
        column: 4,
      },
      rule: ruleName,
      message: MISSING_FEATURE_NAME,
    }]);
  });
});
