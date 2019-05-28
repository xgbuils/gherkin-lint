const ruleName = 'no-files-without-scenarios';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-files-without-scenarios.js');
const NO_FILE_WITHOUT_SCENARIOS = 'Feature file does not have any Scenarios';
const runTest = ruleTestBase.createRuleTest(rule);

describe('No files without scenarios Rule', () => {
  it('doesn\'t raise errors when there are no violations', () => {
    return runTest('no-files-without-scenarios/NoViolations.feature', {}, []);
  });

  it('detects errors when there are not scenarios', () => {
    return runTest('no-files-without-scenarios/Violations.feature', {}, [{
      location: {
        line: 1,
        column: 1,
      },
      rule: ruleName,
      message: NO_FILE_WITHOUT_SCENARIOS,
    }]);
  });
});
