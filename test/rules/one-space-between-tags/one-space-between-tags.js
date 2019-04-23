const ruleName = 'one-space-between-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/one-space-between-tags.js');
const runTest = ruleTestBase.createRuleTest(rule, ({left, right}) =>
  `There is more than one space between the tags ${left} and ${right}`);

describe('One space between tags rule', function() {
  it('doesn\'t raise errors when there are no violations', function() {
    runTest('one-space-between-tags/NoViolations.feature', {}, []);
  });

  it('detects errors for tags on features, scenarios, and scenario outlines', function() {
    runTest('one-space-between-tags/Violations.feature', {}, [{
      location: {
        line: 1,
        column: 13,
      },
      rule: ruleName,
      messageElements: {left: '@featuretag1', right: '@featuretag2'},
    }, {
      location: {
        line: 9,
        column: 14,
      },
      rule: ruleName,
      messageElements: {left: '@scenariotag3', right: '@scenariotag4'},
    }, {
      location: {
        line: 9,
        column: 30,
      },
      rule: ruleName,
      messageElements: {left: '@scenariotag4', right: '@scenariotag5'},
    }, {
      location: {
        line: 13,
        column: 14,
      },
      rule: ruleName,
      messageElements: {left: '@scenariotag5', right: '@scenariotag6'},
    }, {
      location: {
        line: 22,
        column: 13,
      },
      rule: ruleName,
      messageElements: {left: '@exampletag6', right: '@exampletag7'},
    }]);
  });
});
