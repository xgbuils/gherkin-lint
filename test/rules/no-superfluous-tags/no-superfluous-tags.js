const ruleName = 'no-superfluous-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-superfluous-tags.js');
const runTest = ruleTestBase.createRuleTest(rule);
const message = ({tag, label}) => `${tag} tag is already used at ${label} level`;

describe('No Superfluous Tags Rule', () => {
  it('does not raise errors when there are no violations', () => {
    return runTest('no-superfluous-tags/NoViolations.feature', {}, []);
  });

  it('does not raise errors when there are no tags', () => {
    return runTest('no-superfluous-tags/NoTags.feature', {}, []);
  });

  it('does not raise errors with empty file', () => {
    return runTest('Empty.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', () => {
    return runTest('no-superfluous-tags/SuperfluousScenarioTags.feature', {}, [{
      location: {
        line: 7,
        column: 3,
      },
      rule: ruleName,
      message: message({tag: '@superfluoustag1', label: 'feature'}),
    }, {
      location: {
        line: 11,
        column: 2,
      },
      rule: ruleName,
      message: message({tag: '@superfluoustag1', label: 'feature'}),
    }, {
      location: {
        line: 11,
        column: 24,
      },
      rule: ruleName,
      message: message({tag: '@superfluoustag2', label: 'feature'}),
    }]);
  });

  it('detects errors for examples', () => {
    return runTest('no-superfluous-tags/SuperfluousExampleTags.feature', {}, [{
      location: {
        line: 10,
        column: 13,
      },
      rule: ruleName,
      message: message({tag: '@superfluoustag1', label: 'feature'}),
    }, {
      location: {
        line: 18,
        column: 9,
      },
      rule: ruleName,
      message: message({tag: '@superfluoustag2', label: 'scenario'}),
    }]);
  });

  it('detects errors for combined superfluous tags', () => {
    return runTest('no-superfluous-tags/CombinedSuperfluousTags.feature', {}, [{
      location: {
        line: 7,
        column: 6,
      },
      rule: ruleName,
      message: message({tag: '@superfluoustag', label: 'feature'}),
    }, {
      location: {
        line: 10,
        column: 13,
      },
      rule: ruleName,
      message: message({tag: '@superfluoustag', label: 'feature'}),
    }]);
  });
});
