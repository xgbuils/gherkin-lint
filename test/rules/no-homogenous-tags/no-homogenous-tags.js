const ruleName = 'no-homogenous-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-homogenous-tags.js');
const runTest = ruleTestBase.createRuleTest(rule, ({tag}) =>
  `${tag} tag is declared in each scenario. It could be defined at feature level.`);

describe('No Homogenous Tags Rule', function() {
  it('doesn\'t raise errors when there are no violations', function() {
    runTest('no-homogenous-tags/NoViolations.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', function() {
    runTest('no-homogenous-tags/Violations.feature', {}, [{
      location: {
        line: 1,
        column: 1,
      },
      rule: ruleName,
      messageElements: {tag: '@tag1'},
    }, {
      location: {
        line: 1,
        column: 1,
      },
      rule: ruleName,
      messageElements: {tag: '@tag2'},
    }]);
  });
});
