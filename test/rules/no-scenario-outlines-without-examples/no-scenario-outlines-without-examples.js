const ruleName = 'no-scenario-outlines-without-examples';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-scenario-outlines-without-examples.js');
const NO_OUTLINE_WITHOUT_EXAMPLES = 'Scenario Outline does not have any Examples';
const runTest = ruleTestBase.createRuleTest(rule);

describe('No Scenario Outline Without Examples Rule', function() {
  it('doesn\'t raise errors when there are no forbidden tags', function() {
    runTest('no-scenario-outlines-without-examples/NoViolations.feature', {}, []);
  });

  it('detects errors for features, scenarios, and scenario outlines when there are forbidden tags', function() {
    runTest('no-scenario-outlines-without-examples/Violations.feature', {}, [{
      message: NO_OUTLINE_WITHOUT_EXAMPLES,
      rule: ruleName,
      location: {
        line: 9,
        column: 3,
      },
    }, {
      message: NO_OUTLINE_WITHOUT_EXAMPLES,
      rule: ruleName,
      location: {
        line: 12,
        column: 1,
      },
    }, {
      message: NO_OUTLINE_WITHOUT_EXAMPLES,
      rule: ruleName,
      location: {
        line: 16,
        column: 4,
      },
    }]);
  });
});
