const ruleName = 'no-dupe-scenario-names';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-dupe-scenario-names');
const runTest = ruleTestBase.createRuleTest(rule);
const message = ({files}) => `Scenario name is already used in: ${files}`;
const PATH = 'test/rules/';
const NO_VIOLATIONS_FILE = 'no-dupe-scenario-names/NoViolations.feature';
const VIOLATIONS_FILE = 'no-dupe-scenario-names/Violations.feature';

describe('No Duplicate Scenario Names Rule', () => {
  it('doesn\'t raise errors when there are no violations', () => {
    return runTest(NO_VIOLATIONS_FILE, {}, []);
  });

  it('detects errors for features, scenarios, and scenario outlines', () => {
    return runTest(VIOLATIONS_FILE, {}, [{
      message: message({
        files: [
          `${PATH}${VIOLATIONS_FILE}:7`,
        ].join(','),
      }),
      rule: ruleName,
      location: {
        line: 10,
        column: 3,
      },
    },
    {
      message: message({
        files: [
          `${PATH}${VIOLATIONS_FILE}:7`,
          `${PATH}${VIOLATIONS_FILE}:10`,
        ].join(', '),
      }),
      rule: ruleName,
      location: {
        line: 16,
        column: 1,
      },
    }, {
      message: message({
        files: [
          `${PATH}${VIOLATIONS_FILE}:7`,
          `${PATH}${VIOLATIONS_FILE}:10`,
          `${PATH}${VIOLATIONS_FILE}:16`,
        ].join(', '),
      }),
      rule: ruleName,
      location: {
        line: 19,
        column: 1,
      },
    }]);
  });
});
