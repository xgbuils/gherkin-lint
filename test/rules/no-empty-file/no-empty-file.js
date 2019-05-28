const ruleName = 'no-empty-file';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-empty-file.js');
const NO_EMPTY_FILE = 'Empty feature files are disallowed';
const runTest = ruleTestBase.createRuleTest(rule);

describe('No empty files Rule', () => {
  it('doesn\'t raise errors when there are no violations', () => {
    return runTest('no-empty-file/NoViolations.feature', {}, []);
  });

  it('detects errors for empty file', () => {
    return runTest('no-empty-file/BlankFile.feature', {}, [{
      location: {
        line: 1,
        column: 1,
      },
      rule: ruleName,
      message: NO_EMPTY_FILE,
    }]);
  });

  it('detects errors for blank file', () => {
    return runTest('no-empty-file/BlankFile.feature', {}, [{
      location: {
        line: 1,
        column: 1,
      },
      rule: ruleName,
      message: NO_EMPTY_FILE,
    }]);
  });
});
