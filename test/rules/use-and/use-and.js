const ruleName = 'use-and';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/use-and.js');
const runTest = ruleTestBase.createRuleTest(rule, ({keyword, text}) =>
  `Step "${keyword} ${text}" should use And instead of ${keyword} `);

describe('Use And Rule', function() {
  it('doesn\'t raise errors when there are no violations', function() {
    runTest('use-and/NoViolations.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', function() {
    runTest('use-and/Violations.feature', {}, [{
      location: {
        line: 9,
        column: 6,
      },
      rule: ruleName,
      messageElements: {keyword: 'Given', text: 'text3'},
    }, {
      location: {
        line: 16,
        column: 2,
      },
      rule: ruleName,
      messageElements: {keyword: 'Then', text: 'text3'},
    }]);
  });
});
