const ruleName = 'one-space-between-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/one-space-between-tags.js');
const runTest = ruleTestBase.createRuleTest(rule);
const message = ({left, right}) =>
  `There is more than one space between the tags ${left} and ${right}`;

describe('One space between tags rule', () => {
  it('doesn\'t raise errors when there are no violations', () => {
    runTest('one-space-between-tags/NoViolations.feature', {}, []);
  });

  it('detects errors for tags on features, scenarios, and scenario outlines', () => {
    runTest('one-space-between-tags/Violations.feature', {}, [{
      location: {
        line: 1,
        column: 13,
      },
      rule: ruleName,
      message: message({left: '@featuretag1', right: '@featuretag2'}),
    }, {
      location: {
        line: 9,
        column: 14,
      },
      rule: ruleName,
      message: message({left: '@scenariotag3', right: '@scenariotag4'}),
    }, {
      location: {
        line: 9,
        column: 30,
      },
      rule: ruleName,
      message: message({left: '@scenariotag4', right: '@scenariotag5'}),
    }, {
      location: {
        line: 13,
        column: 14,
      },
      rule: ruleName,
      message: message({left: '@scenariotag5', right: '@scenariotag6'}),
    }, {
      location: {
        line: 22,
        column: 13,
      },
      rule: ruleName,
      message: message({left: '@exampletag6', right: '@exampletag7'}),
    }]);
  });
});
