const ruleName = 'name-length';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/name-length.js');
const runTest = ruleTestBase.createRuleTest(rule, ({element, length}) =>
  `${element} name is too long. Length of ${length} ` +
      'is longer than the maximum allowed: 70');

describe('Name length rule', function() {
  it('detects an error when property is not "Feature", "Step" or "Scenario"', function() {
    runTest('name-length/CorrectLength.feature', {
      'foobar': 60,
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

  it('doesn\'t raise errors when the default configuration is used and there are no length violations', function() {
    runTest('name-length/CorrectLength.feature', {}, []);
  });

  it('detects errors for features, scenarios, scenario outlines and steps', function() {
    runTest('name-length/WrongLength.feature', {}, [{
      messageElements: {element: 'Feature', length: 89},
      rule: ruleName,
      location: {
        line: 1,
        column: 1,
      },
    }, {
      messageElements: {element: 'Step', length: 94},
      rule: ruleName,
      location: {
        line: 4,
        column: 3,
      },
    }, {
      messageElements: {element: 'Scenario', length: 90},
      rule: ruleName,
      location: {
        line: 6,
        column: 1,
      },
    }, {
      messageElements: {element: 'Step', length: 101},
      rule: ruleName,
      location: {
        line: 7,
        column: 3,
      },
    }, {
      messageElements: {element: 'Scenario', length: 98},
      rule: ruleName,
      location: {
        line: 9,
        column: 1,
      },
    }, {
      messageElements: {element: 'Step', length: 108},
      rule: ruleName,
      location: {
        line: 10,
        column: 3,
      },
    }]);
  });
});
