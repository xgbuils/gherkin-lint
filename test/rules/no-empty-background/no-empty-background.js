const ruleName = 'no-empty-background';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-empty-background.js');
const NO_EMPTY_BACKGROUNDS = 'Empty backgrounds are not allowed.';
const runTest = ruleTestBase.createRuleTest(rule);

describe('No empty Backgrounds Rule', () => {
  it('does not raise errors when there are no background', () => {
    return runTest('no-empty-background/NoBackground.feature', {}, []);
  });

  it('does not raise errors when there are no violations', () => {
    return runTest('no-empty-background/NoViolations.feature', {}, []);
  });

  it('does not raise errors whith an empty file', () => {
    return runTest('Empty.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', () => {
    return runTest('no-empty-background/Violations.feature', {}, [{
      location: {
        line: 4,
        column: 2,
      },
      rule: ruleName,
      message: NO_EMPTY_BACKGROUNDS,
    }]);
  });
});
