const ruleName = 'no-superfluous-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-superfluous-tags.js');
const runTest = ruleTestBase.createRuleTest(rule, ({tag}) =>
  `${tag} tag is already used at Feature level`);

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
      messageElements: {tag: '@superfluoustag1'},
    }, {
      location: {
        line: 11,
        column: 2,
      },
      rule: ruleName,
      messageElements: {tag: '@superfluoustag1'},
    }, {
      location: {
        line: 11,
        column: 24,
      },
      rule: ruleName,
      messageElements: {tag: '@superfluoustag2'},
    }]);
  });
});
