const ruleName = 'no-dupe-feature-names';
const ruleTestBase = require('../rule-test-base');
const EXAMPLE_FILE = 'no-dupe-feature-names/Example.feature';
const OTHER_FILE = 'no-dupe-feature-names/Other.feature';
const rule = require('../../../src/rules/no-dupe-feature-names');
const ruleWithAnotherFile = Object.assign({}, rule, {
  init: () => ({
    features: {
      'Feature with a name': {
        files: [OTHER_FILE],
      },
    },
  }),
});
const message = ({files}) => `Feature name is already used in: ${files}`;


const noViolationTest = ruleTestBase.createRuleTest(rule);
const violationTest = ruleTestBase.createRuleTest(ruleWithAnotherFile);

describe('No Duplicate Scenario Names Rule', () => {
  it('does not raise errors when there are no violations', () => {
    noViolationTest(EXAMPLE_FILE, {}, []);
  });

  it('does not raise errors when there are no violations', () => {
    noViolationTest('Empty.feature', {}, []);
  });

  it('detects errors for features, scenarios, and scenario outlines', () => {
    violationTest(EXAMPLE_FILE, {}, [{
      message: message({files: OTHER_FILE}),
      rule: ruleName,
      location: {
        line: 2,
        column: 3,
      },
    }]);
  });
});
