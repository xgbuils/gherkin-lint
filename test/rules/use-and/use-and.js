const ruleName = 'use-and';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/use-and.js');
const runTest = ruleTestBase.createRuleTest(rule);
const message = ({keyword, text}) =>
  `Step "${keyword} ${text}" should use And instead of ${keyword} `;

describe('Use And Rule', () => {
  it('does not raise errors when there are no violations', () => {
    runTest('use-and/NoViolations.feature', {}, []);
  });

  it('detects errors for scenarios, and scenario outlines', () => {
    runTest('use-and/Violations.feature', {}, [{
      location: {
        line: 9,
        column: 6,
      },
      rule: ruleName,
      message: message({keyword: 'Given', text: 'text3'}),
    }, {
      location: {
        line: 16,
        column: 2,
      },
      rule: ruleName,
      message: message({keyword: 'Then', text: 'text3'}),
    }]);
  });
});
