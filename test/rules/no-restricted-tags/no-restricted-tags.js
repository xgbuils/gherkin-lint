const ruleName = 'no-restricted-tags';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/no-restricted-tags.js');
const runTest = ruleTestBase.createRuleTest(rule);
const message = ({tags, nodeType}) => `Forbidden tag ${tags} on ${nodeType}`;

describe('No Restricted Tags Rule', () => {
  it('detects an error when property is not "tags"', () => {
    runTest('no-restricted-tags/NoViolations.feature', {
      'foobar': ['@featuretag', '@scenariotag'],
    }, {
      type: 'config-error',
      message: 'Error(s) in configuration file:',
      errors: [{
        type: 'config-rule-error',
        rule: 'no-restricted-tags',
        message: 'The rule does not have the specified configuration option "foobar"',
      }],
    });
  });

  it('doesn\'t raise errors when there are no forbidden tags', () => {
    runTest('no-restricted-tags/NoViolations.feature', {
      'tags': ['@featuretag1', '@scenariotag1'],
    }, []);
  });

  it('detects errors for features, scenarios, and scenario outlines when there are forbidden tags', () => {
    runTest('no-restricted-tags/Violations.feature', {
      'tags': [
        '@featuretag1',
        '@anothertag',
        '@scenariotag1',
        '@scenariotag2',
        '@exampletag1',
        '@exampletag2',
      ],
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
        line: 20,
        column: 1,
      },
    },
    {
      message: message({tags: '@exampletag2', nodeType: 'Examples'}),
      rule: ruleName,
      location: {
        line: 24,
        column: 5,
      },
    }]);
  });
});
