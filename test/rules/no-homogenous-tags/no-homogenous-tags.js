const ruleName = 'no-homogenous-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-homogenous-tags.js');
const runTest = ruleTestBase.createRuleTest(rule);
const message = ({tag, parent, children}) =>
  `${tag} tag is declared in each ${children}. It could be defined at ${parent} level.`;

describe('No Homogenous Tags Rule', function() {
  it('doesn\'t raise errors when there are no violations', function() {
    runTest('no-homogenous-tags/NoViolations.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', function() {
    runTest('no-homogenous-tags/HomogenousScenarioTags.feature', {}, [{
      location: {
        line: 1,
        column: 1,
      },
      rule: ruleName,
      message: message({tag: '@tag1', children: 'scenario', parent: 'feature'}),
    }, {
      location: {
        line: 1,
        column: 1,
      },
      rule: ruleName,
      message: message({tag: '@tag2', children: 'scenario', parent: 'feature'}),
    }]);
  });

  it('detects errors for examples', function() {
    runTest('no-homogenous-tags/HomogenousExampleTags.feature', {}, [{
      location: {
        line: 11,
        column: 1,
      },
      rule: ruleName,
      message: message({tag: '@tag2', children: 'example', parent: 'scenario'}),
    }]);
  });
});
