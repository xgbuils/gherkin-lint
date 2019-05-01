const ruleName = 'no-superfluous-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-superfluous-tags.js');
const runTest = ruleTestBase.createRuleTest(rule, ({tags}) =>
  `Tag(s) duplicated on a Feature and a Scenario in that Feature: ${tags}`);

describe('No Superfluous Tags Rule', function() {
  it('does not raise errors when there are no violations', function() {
    runTest('no-superfluous-tags/NoViolations.feature', {}, []);
  });

  it('does not raise errors when there are no tags', function() {
    runTest('no-superfluous-tags/NoTags.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', function() {
    runTest('no-superfluous-tags/Violations.feature', {}, [{
      location: {
        line: 7,
        column: 3,
      },
      rule: ruleName,
      messageElements: {tags: '@superfluoustag1'},
    }, {
      location: {
        line: 11,
        column: 2,
      },
      rule: ruleName,
      messageElements: {tags: '@superfluoustag1, @superfluoustag2'},
    }]);
  });
});
