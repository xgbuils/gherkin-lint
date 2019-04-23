const ruleName = 'no-unnamed-scenarios';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-unnamed-scenarios.js');
const runTest = ruleTestBase.createRuleTest(rule, () => 'Missing Scenario name');

describe('No Unnamed Scenarios Rule', function() {
  it('doesn\'t raise errors when there are no violations', function() {
    runTest('no-unnamed-scenarios/NoViolations.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', function() {
    runTest('no-unnamed-scenarios/Violations.feature', {}, [{
      location: {
        line: 6,
        column: 2,
      },
      rule: ruleName,
      messageElements: {},
    }, {
      location: {
        line: 9,
        column: 7,
      },
      rule: ruleName,
      messageElements: {},
    }]);
  });
});
