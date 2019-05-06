const ruleName = 'no-duplicate-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-duplicate-tags.js');
const runTest = ruleTestBase.createRuleTest(rule, ({tags}) =>
  `Duplicate tags are not allowed: ${tags}`);

describe('No Duplicate Tags Rule', () => {
  it('doesn\'t raise errors when there are no tags', () => {
    runTest('no-duplicate-tags/NoTags.feature', {}, []);
  });

  it('doesn\'t raise errors when there are no duplicated tags', () => {
    runTest('no-duplicate-tags/NoViolations.feature', {}, []);
  });

  it('detects errors for features, scenarios, and scenario outlines when there are duplications', () => {
    runTest('no-duplicate-tags/Violations.feature', {}, [{
      messageElements: {tags: '@featuretag'},
      rule: ruleName,
      location: {
        line: 1,
        column: 13,
      },
    },
    {
      messageElements: {tags: '@scenariotag'},
      rule: ruleName,
      location: {
        line: 7,
        column: 14,
      },
    },
    {
      messageElements: {tags: '@scenariotag'},
      rule: ruleName,
      location: {
        line: 7,
        column: 27,
      },
    },
    {
      messageElements: {tags: '@scenariotag'},
      rule: ruleName,
      location: {
        line: 11,
        column: 14,
      },
    },
    {
      messageElements: {tags: '@exampletag'},
      rule: ruleName,
      location: {
        line: 14,
        column: 15,
      },
    },
    {
      messageElements: {tags: '@exampletag'},
      rule: ruleName,
      location: {
        line: 14,
        column: 27,
      },
    }]);
  });
});
