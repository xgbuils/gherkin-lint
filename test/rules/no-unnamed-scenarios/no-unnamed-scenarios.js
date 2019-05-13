const ruleName = 'no-unnamed-scenarios';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-unnamed-scenarios.js');
const MISSING_SCENARIO_NAME = 'Missing Scenario name';
const runTest = ruleTestBase.createRuleTest(rule, () => 'Missing Scenario name');

describe('No Unnamed Scenarios Rule', () => {
  it('does not raise errors when there are no violations', () => {
    runTest('no-unnamed-scenarios/NoViolations.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', () => {
    runTest('no-unnamed-scenarios/Violations.feature', {}, [{
      location: {
        line: 6,
        column: 2,
      },
      rule: ruleName,
      message: MISSING_SCENARIO_NAME,
    }, {
      location: {
        line: 9,
        column: 7,
      },
      rule: ruleName,
      message: MISSING_SCENARIO_NAME,
    }]);
  });
});
