const ruleName = 'no-superfluous-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-superfluous-tags.js');
const runTest = ruleTestBase.createRuleTest(rule, ({tag, label}) =>
  `${tag} tag is already used at ${label} level`);

describe('No Superfluous Tags Rule', function() {
  it('does not raise errors when there are no violations', function() {
    runTest('no-superfluous-tags/NoViolations.feature', {}, []);
  });

  it('does not raise errors when there are no tags', function() {
    runTest('no-superfluous-tags/NoTags.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', function() {
    runTest('no-superfluous-tags/SuperfluousScenarioTags.feature', {}, [{
      location: {
        line: 7,
        column: 3,
      },
      rule: ruleName,
      messageElements: {tag: '@superfluoustag1', label: 'feature'},
    }, {
      location: {
        line: 11,
        column: 2,
      },
      rule: ruleName,
      messageElements: {tag: '@superfluoustag1', label: 'feature'},
    }, {
      location: {
        line: 11,
        column: 24,
      },
      rule: ruleName,
      messageElements: {tag: '@superfluoustag2', label: 'feature'},
    }]);
  });

  it('detects errors for examples', function() {
    runTest('no-superfluous-tags/SuperfluousExampleTags.feature', {}, [{
      location: {
        line: 10,
        column: 13,
      },
      rule: ruleName,
      messageElements: {tag: '@superfluoustag1', label: 'feature'},
    }, {
      location: {
        line: 18,
        column: 9,
      },
      rule: ruleName,
      messageElements: {tag: '@superfluoustag2', label: 'scenario'},
    }]);
  });

  it('detects errors for combined superfluous tags', function() {
    runTest('no-superfluous-tags/CombinedSuperfluousTags.feature', {}, [{
      location: {
        line: 7,
        column: 6,
      },
      rule: ruleName,
      messageElements: {tag: '@superfluoustag', label: 'feature'},
    }, {
      location: {
        line: 10,
        column: 13,
      },
      rule: ruleName,
      messageElements: {tag: '@superfluoustag', label: 'feature'},
    }]);
  });
});
