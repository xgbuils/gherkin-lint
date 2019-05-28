const ruleName = 'no-partially-commented-tag-lines';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-partially-commented-tag-lines');
const NO_PARTIALLY_COMMENTED_TAGS = 'Partially commented tag lines not allowed ';
const runTest = ruleTestBase.createRuleTest(rule);

describe('No partially commented tag lines Rule', () => {
  it('doesn\'t raise errors when there are no violations', () => {
    return runTest('no-partially-commented-tag-lines/NoViolations.feature', {}, []);
  });

  it('detects errors there are multiple empty lines', () => {
    return runTest('no-partially-commented-tag-lines/Violations.feature', {}, [{
      location: {
        line: 6,
        column: 13,
      },
      rule: ruleName,
      message: NO_PARTIALLY_COMMENTED_TAGS,
    }, {
      location: {
        line: 10,
        column: 7,
      },
      rule: ruleName,
      message: NO_PARTIALLY_COMMENTED_TAGS,
    }, {
      location: {
        line: 13,
        column: 12,
      },
      rule: ruleName,
      message: NO_PARTIALLY_COMMENTED_TAGS,
    }, {
      location: {
        line: 17,
        column: 7,
      },
      rule: ruleName,
      message: NO_PARTIALLY_COMMENTED_TAGS,
    }, {
      location: {
        line: 23,
        column: 8,
      },
      rule: ruleName,
      message: NO_PARTIALLY_COMMENTED_TAGS,
    }]);
  });
});
