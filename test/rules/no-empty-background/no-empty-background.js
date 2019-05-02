const ruleName = 'no-empty-background';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-empty-background.js');
const runTest = ruleTestBase.createRuleTest(rule,
  () => 'Empty backgrounds are not allowed.');

describe('No empty Backgrounds Rule', function() {
  it('does not raise errors when there are no background', function() {
    runTest('no-empty-background/NoBackground.feature', {}, []);
  });

  it('does not raise errors when there are no violations', function() {
    runTest('no-empty-background/NoViolations.feature', {}, []);
  });

  it('does not raise errors whith an empty file', function() {
    runTest('Empty.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', function() {
    runTest('no-empty-background/Violations.feature', {}, [{
      location: {
        line: 4,
        column: 2,
      },
      rule: ruleName,
      messageElements: {},
    }]);
  });
});
