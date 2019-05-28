const ruleName = 'no-background-only-scenario';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-background-only-scenario.js');
const NO_BACKGROUND = 'Backgrounds are not allowed when there is just one scenario.';
const runTest = ruleTestBase.createRuleTest(rule);

describe('No Background Only Scenario Rule', () => {
  it('does not raise errors when there are no background', () => {
    return runTest('no-background-only-scenario/NoBackground.feature', {}, []);
  });

  it('does not raise errors when there are more than one scenario', () => {
    return runTest('no-background-only-scenario/NoViolationsTwoScenarios.feature', {}, []);
  });

  it('does not raise errors when there are zero scenarios', () => {
    return runTest('no-background-only-scenario/NoViolationsZeroScenarios.feature', {}, []);
  });

  it('does not raise errors with empty file', () => {
    return runTest('Empty.feature', {}, []);
  });

  it('detects errors when there are violations with Scenario', () => {
    return runTest('no-background-only-scenario/ViolationsScenario.feature', {}, [{
      location: {
        line: 4,
        column: 1,
      },
      rule: ruleName,
      message: NO_BACKGROUND,
    }]);
  });

  it('detects errors when there are violations with Scenario Outline', () => {
    return runTest('no-background-only-scenario/ViolationsOutline.feature', {}, [{
      location: {
        line: 3,
        column: 2,
      },
      rule: ruleName,
      message: NO_BACKGROUND,
    }]);
  });
});
