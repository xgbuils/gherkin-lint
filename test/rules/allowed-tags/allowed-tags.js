const ruleName = 'allowed-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/allowed-tags.js');
const runTest = ruleTestBase.createRuleTest(rule);
const message = ({tags, nodeType}) => `Not allowed tag ${tags} on ${nodeType}`;

describe('No Allowed Tags Rule', () => {
  it('detects an error when property is not "tags"', () => {
    runTest('allowed-tags/NoViolations.feature', {
      'foobar': ['@featuretag', '@scenariotag'],
    }, {
      type: 'config-error',
      message: 'Error(s) in configuration file:',
      errors: [{
        type: 'config-rule-error',
        rule: ruleName,
        message: 'The rule does not have the specified configuration option "foobar"',
      }],
    });
  });

  it('doesn\'t raise errors when the file is empty', () => {
    runTest('Empty.feature', {
      'tags': ['@featuretag', '@scenariotag'],
    }, []);
  });

  it('doesn\'t raise errors when there are no violations', () => {
    runTest('allowed-tags/NoViolations.feature', {
      'tags': ['@featuretag', '@scenariotag'],
    }, []);
  });

  it('detects errors for features, scenarios, and scenario outlines', () => {
    runTest('allowed-tags/Violations.feature', {
      'tags': ['@featuretag', '@scenariotag', '@exampletag'],
    }, [{
      message: message({tags: '@featuretag1', nodeType: 'Feature'}),
      rule: ruleName,
      location: {
        line: 1,
        column: 13,
      },
    },
    {
      message: message({tags: '@anothertag', nodeType: 'Feature'}),
      rule: ruleName,
      location: {
        line: 1,
        column: 26,
      },
    },
    {
      message: message({tags: '@scenariotag1', nodeType: 'Scenario'}),
      rule: ruleName,
      location: {
        line: 7,
        column: 14,
      },
    },
    {
      message: message({tags: '@scenariotag2', nodeType: 'Scenario'}),
      rule: ruleName,
      location: {
        line: 7,
        column: 28,
      },
    },
    {
      message: message({tags: '@anothertag', nodeType: 'Scenario'}),
      rule: ruleName,
      location: {
        line: 7,
        column: 42,
      },
    },
    {
      message: message({tags: '@scenariotag1', nodeType: 'ScenarioOutline'}),
      rule: ruleName,
      location: {
        line: 11,
        column: 14,
      },
    },
    {
      message: message({tags: '@exampletag1', nodeType: 'Examples'}),
      rule: ruleName,
      location: {
        line: 14,
        column: 1,
      },
    },
    {
      message: message({tags: '@exampletag2', nodeType: 'Examples'}),
      rule: ruleName,
      location: {
        line: 17,
        column: 2,
      },
    }]);
  });
});
