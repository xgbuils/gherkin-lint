const ruleName = 'indentation';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/indentation.js');
const runTest = ruleTestBase.createRuleTest(rule);
const message = ({element, expected, actual}) => {
  return `Wrong indentation for "${element}", expected indentation level of ` +
      `${expected}, but got ${actual}`;
};

const wrongIndentationErrors = [{
  message: message({element: 'Feature', expected: 0, actual: 1}),
  rule: ruleName,
  location: {
    line: 2,
    column: 2,
  },
}, {
  message: message({element: 'feature tag', expected: 0, actual: 1}),
  rule: ruleName,
  location: {
    line: 1,
    column: 2,
  },
}, {
  message: message({element: 'Background', expected: 0, actual: 4}),
  rule: ruleName,
  location: {
    line: 4,
    column: 5,
  },
}, {
  message: message({element: 'Step', expected: 2, actual: 0}),
  rule: ruleName,
  location: {
    line: 5,
    column: 1,
  },
}, {
  message: message({element: 'Scenario', expected: 0, actual: 1}),
  rule: ruleName,
  location: {
    line: 9,
    column: 2,
  },
}, {
  message: message({element: 'scenario tag', expected: 0, actual: 1}),
  rule: ruleName,
  location: {
    line: 7,
    column: 2,
  },
}, {
  message: message({element: 'scenario tag', expected: 0, actual: 1}),
  rule: ruleName,
  location: {
    line: 8,
    column: 2,
  },
}, {
  message: message({element: 'Step', expected: 2, actual: 3}),
  rule: ruleName,
  location: {
    line: 10,
    column: 4,
  },
}, {
  message: message({element: 'Scenario', expected: 0, actual: 3}),
  rule: ruleName,
  location: {
    line: 14,
    column: 4,
  },
}, {
  message: message({element: 'Examples', expected: 0, actual: 2}),
  rule: ruleName,
  location: {
    line: 16,
    column: 3,
  },
}, {
  message: message({element: 'example', expected: 2, actual: 4}),
  rule: ruleName,
  location: {
    line: 17,
    column: 5,
  },
}, {
  message: message({element: 'example', expected: 2, actual: 4}),
  rule: ruleName,
  location: {
    line: 18,
    column: 5,
  },
}, {
  message: message({element: 'scenario tag', expected: 0, actual: 3}),
  rule: ruleName,
  location: {
    line: 12,
    column: 4,
  },
}, {
  message: message({element: 'scenario tag', expected: 0, actual: 4}),
  rule: ruleName,
  location: {
    line: 13,
    column: 5,
  },
}, {
  message: message({element: 'Step', expected: 2, actual: 3}),
  rule: ruleName,
  location: {
    line: 15,
    column: 4,
  },
}];

describe('Indentation rule', () => {
  it('doesn\'t raise errors when the default conifguration is used and there are no indentation violations (spaces)', () => {
    return runTest('indentation/CorrectIndentationSpaces.feature', {}, []);
  });

  it('doesn\'t raise errors when scenario outline does not have examples', () => {
    return runTest('indentation/CorrectIndentationWithoutExamples.feature', {}, []);
  });

  it('doesn\'t raise errors when the file is empty', () => {
    return runTest('Empty.feature', {}, []);
  });

  it('doesn\'t raise errors when the default conifguration is used are and there no indentation violations (tabs)', () => {
    return runTest('indentation/CorrectIndentationTabs.feature', {}, []);
  });

  it('detects errors for features, backgrounds, scenarios, scenario outlines and steps (spaces)', () => {
    return runTest('indentation/WrongIndentationSpaces.feature', {}, wrongIndentationErrors);
  });

  it('detects errors for features, backgrounds, scenarios, scenario outlines and steps (tabs)', () => {
    return runTest('indentation/WrongIndentationTabs.feature', {}, wrongIndentationErrors);
  });

  it('detects errors for features, backgrounds, scenarios, scenario outlines and steps in other languages', () => {
    return runTest('indentation/WrongIndentationDifferentLanguage.feature', {}, [{
      message: message({element: 'Feature', expected: 0, actual: 4}),
      rule: ruleName,
      location: {
        line: 3,
        column: 5,
      },
    }, {
      message: message({element: 'feature tag', expected: 0, actual: 4}),
      rule: ruleName,
      location: {
        line: 2,
        column: 5,
      },
    }, {
      message: message({element: 'Background', expected: 0, actual: 4}),
      rule: ruleName,
      location: {
        line: 5,
        column: 5,
      },
    }, {
      message: message({element: 'Step', expected: 2, actual: 0}),
      rule: ruleName,
      location: {
        line: 6,
        column: 1,
      },
    }, {
      message: message({element: 'Scenario', expected: 0, actual: 4}),
      rule: ruleName,
      location: {
        line: 10,
        column: 5,
      },
    }, {
      message: message({element: 'scenario tag', expected: 0, actual: 4}),
      rule: ruleName,
      location: {
        line: 8,
        column: 5,
      },
    }, {
      message: message({element: 'scenario tag', expected: 0, actual: 1}),
      rule: ruleName,
      location: {
        line: 9,
        column: 2,
      },
    }, {
      message: message({element: 'Step', expected: 2, actual: 12}),
      rule: ruleName,
      location: {
        line: 11,
        column: 13,
      },
    }, {
      message: message({element: 'Scenario', expected: 0, actual: 12}),
      rule: ruleName,
      location: {
        line: 15,
        column: 13,
      },
    }, {
      message: message({element: 'Examples', expected: 0, actual: 7}),
      rule: ruleName,
      location: {
        line: 17,
        column: 8,
      },
    }, {
      message: message({element: 'example', expected: 2, actual: 15}),
      rule: ruleName,
      location: {
        line: 18,
        column: 16,
      },
    }, {
      message: message({element: 'example', expected: 2, actual: 15}),
      rule: ruleName,
      location: {
        line: 19,
        column: 16,
      },
    }, {
      message: message({element: 'scenario tag', expected: 0, actual: 4}),
      rule: ruleName,
      location: {
        line: 13,
        column: 5,
      },
    }, {
      message: message({element: 'scenario tag', expected: 0, actual: 1}),
      rule: ruleName,
      location: {
        line: 14,
        column: 2,
      },
    }, {
      message: message({element: 'Step', expected: 2, actual: 11}),
      rule: ruleName,
      location: {
        line: 16,
        column: 12,
      },
    }]);
  });

  it('defaults the tag indentation settings when they are not set', () => {
    return runTest('indentation/CorrectIndentationWithFeatureAndScenarioOverrides.feature', {
      'Feature': 1,
      'Scenario': 3,
    }, []);
  });

  it('observe tag indentation settings when they are overriden', () => {
    return runTest('indentation/CorrectIndentationWithScenarioTagOverrides.feature', {
      'scenario tag': 3,
    }, []);
  });

  it('Wrong "then" step in customized configuration', () => {
    return runTest('indentation/WrongSteps.feature', {
      Feature: 1,
      Background: 4,
      Scenario: 1,
      Examples: 2,
      example: 4,
      then: 0,
    }, [{
      message: message({element: 'then', expected: 0, actual: 3}),
      rule: ruleName,
      location: {
        line: 7,
        column: 4,
      },
    }, {
      message: message({element: 'then', expected: 0, actual: 5}),
      rule: ruleName,
      location: {
        line: 12,
        column: 6,
      },
    }]);
  });

  context('DocString', () => {
    it('Correct indentation', () => {
      return runTest('indentation/CorrectIndentationDocStrings.feature', {
        DocString: 4,
      }, []);
    });

    it('Wrong indentation', () => {
      return runTest('indentation/WrongIndentationDocStrings.feature', {
        DocString: 4,
      }, [{
        message: message({element: 'DocString', expected: 4, actual: 2}),
        rule: ruleName,
        location: {
          line: 5,
          column: 3,
        },
      }, {
        message: message({element: 'DocString line', expected: 4, actual: 2}),
        rule: ruleName,
        location: {
          line: 14,
          column: 3,
        },
      }]);
    });
  });
});
