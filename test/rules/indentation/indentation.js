const ruleName = 'indentation';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/indentation.js');
const runTest = ruleTestBase.createRuleTest(rule, ({element, expected, actual}) => {
  return `Wrong indentation for "${element}", expected indentation level of ` +
      `${expected}, but got ${actual}`;
});

const wrongIndentationErrors = [{
  messageElements: {element: 'Feature', expected: 0, actual: 1},
  rule: ruleName,
  location: {
    line: 2,
    column: 2,
  },
}, {
  messageElements: {element: 'feature tag', expected: 0, actual: 1},
  rule: ruleName,
  location: {
    line: 1,
    column: 2,
  },
}, {
  messageElements: {element: 'Background', expected: 0, actual: 4},
  rule: ruleName,
  location: {
    line: 4,
    column: 5,
  },
}, {
  messageElements: {element: 'Step', expected: 2, actual: 0},
  rule: ruleName,
  location: {
    line: 5,
    column: 1,
  },
}, {
  messageElements: {element: 'Scenario', expected: 0, actual: 1},
  rule: ruleName,
  location: {
    line: 9,
    column: 2,
  },
}, {
  messageElements: {element: 'scenario tag', expected: 0, actual: 1},
  rule: ruleName,
  location: {
    line: 7,
    column: 2,
  },
}, {
  messageElements: {element: 'scenario tag', expected: 0, actual: 1},
  rule: ruleName,
  location: {
    line: 8,
    column: 2,
  },
}, {
  messageElements: {element: 'Step', expected: 2, actual: 3},
  rule: ruleName,
  location: {
    line: 10,
    column: 4,
  },
}, {
  messageElements: {element: 'Scenario', expected: 0, actual: 3},
  rule: ruleName,
  location: {
    line: 14,
    column: 4,
  },
}, {
  messageElements: {element: 'Examples', expected: 0, actual: 2},
  rule: ruleName,
  location: {
    line: 16,
    column: 3,
  },
}, {
  messageElements: {element: 'example', expected: 2, actual: 4},
  rule: ruleName,
  location: {
    line: 17,
    column: 5,
  },
}, {
  messageElements: {element: 'example', expected: 2, actual: 4},
  rule: ruleName,
  location: {
    line: 18,
    column: 5,
  },
}, {
  messageElements: {element: 'scenario tag', expected: 0, actual: 3},
  rule: ruleName,
  location: {
    line: 12,
    column: 4,
  },
}, {
  messageElements: {element: 'scenario tag', expected: 0, actual: 4},
  rule: ruleName,
  location: {
    line: 13,
    column: 5,
  },
}, {
  messageElements: {element: 'Step', expected: 2, actual: 3},
  rule: ruleName,
  location: {
    line: 15,
    column: 4,
  },
}];

describe('Indentation rule', () => {
  it('doesn\'t raise errors when the default conifguration is used and there are no indentation violations (spaces)', function() {
    runTest('indentation/CorrectIndentationSpaces.feature', {}, []);
  });

  it('doesn\'t raise errors when scenario outline does not have examples', () => {
    runTest('indentation/CorrectIndentationWithoutExamples.feature', {}, []);
  });

  it('doesn\'t raise errors when the file is empty', function() {
    runTest('Empty.feature', {}, []);
  });

  it('doesn\'t raise errors when the default conifguration is used are and there no indentation violations (tabs)', function() {
    runTest('indentation/CorrectIndentationTabs.feature', {}, []);
  });

  it('detects errors for features, backgrounds, scenarios, scenario outlines and steps (spaces)', function() {
    runTest('indentation/WrongIndentationSpaces.feature', {}, wrongIndentationErrors);
  });

  it('detects errors for features, backgrounds, scenarios, scenario outlines and steps (tabs)', function() {
    runTest('indentation/WrongIndentationTabs.feature', {}, wrongIndentationErrors);
  });

  it('detects errors for features, backgrounds, scenarios, scenario outlines and steps in other languages', function() {
    runTest('indentation/WrongIndentationDifferentLanguage.feature', {}, [{
      messageElements: {element: 'Feature', expected: 0, actual: 4},
      rule: ruleName,
      location: {
        line: 3,
        column: 5,
      },
    }, {
      messageElements: {element: 'feature tag', expected: 0, actual: 4},
      rule: ruleName,
      location: {
        line: 2,
        column: 5,
      },
    }, {
      messageElements: {element: 'Background', expected: 0, actual: 4},
      rule: ruleName,
      location: {
        line: 5,
        column: 5,
      },
    }, {
      messageElements: {element: 'Step', expected: 2, actual: 0},
      rule: ruleName,
      location: {
        line: 6,
        column: 1,
      },
    }, {
      messageElements: {element: 'Scenario', expected: 0, actual: 4},
      rule: ruleName,
      location: {
        line: 10,
        column: 5,
      },
    }, {
      messageElements: {element: 'scenario tag', expected: 0, actual: 4},
      rule: ruleName,
      location: {
        line: 8,
        column: 5,
      },
    }, {
      messageElements: {element: 'scenario tag', expected: 0, actual: 1},
      rule: ruleName,
      location: {
        line: 9,
        column: 2,
      },
    }, {
      messageElements: {element: 'Step', expected: 2, actual: 12},
      rule: ruleName,
      location: {
        line: 11,
        column: 13,
      },
    }, {
      messageElements: {element: 'Scenario', expected: 0, actual: 12},
      rule: ruleName,
      location: {
        line: 15,
        column: 13,
      },
    }, {
      messageElements: {element: 'Examples', expected: 0, actual: 7},
      rule: ruleName,
      location: {
        line: 17,
        column: 8,
      },
    }, {
      messageElements: {element: 'example', expected: 2, actual: 15},
      rule: ruleName,
      location: {
        line: 18,
        column: 16,
      },
    }, {
      messageElements: {element: 'example', expected: 2, actual: 15},
      rule: ruleName,
      location: {
        line: 19,
        column: 16,
      },
    }, {
      messageElements: {element: 'scenario tag', expected: 0, actual: 4},
      rule: ruleName,
      location: {
        line: 13,
        column: 5,
      },
    }, {
      messageElements: {element: 'scenario tag', expected: 0, actual: 1},
      rule: ruleName,
      location: {
        line: 14,
        column: 2,
      },
    }, {
      messageElements: {element: 'Step', expected: 2, actual: 11},
      rule: ruleName,
      location: {
        line: 16,
        column: 12,
      },
    }]);
  });

  it('defaults the tag indentation settings when they are not set', function() {
    runTest('indentation/CorrectIndentationWithFeatureAndScenarioOverrides.feature', {
      'Feature': 1,
      'Scenario': 3,
    }, []);
  });

  it('observe tag indentation settings when they are overriden', function() {
    runTest('indentation/CorrectIndentationWithScenarioTagOverrides.feature', {
      'scenario tag': 3,
    }, []);
  });

  it('Wrong "then" step in customized configuration', function() {
    runTest('indentation/WrongSteps.feature', {
      Feature: 1,
      Background: 4,
      Scenario: 1,
      Examples: 2,
      example: 4,
      then: 0,
    }, [{
      messageElements: {element: 'then', expected: 0, actual: 3},
      rule: ruleName,
      location: {
        line: 7,
        column: 4,
      },
    }, {
      messageElements: {element: 'then', expected: 0, actual: 5},
      rule: ruleName,
      location: {
        line: 12,
        column: 6,
      },
    }]);
  });

  context('DocString', () => {
    it('Correct indentation', function() {
      runTest('indentation/CorrectIndentationDocStrings.feature', {
        DocString: 4,
      }, []);
    });

    it('Wrong indentation', function() {
      runTest('indentation/WrongIndentationDocStrings.feature', {
        DocString: 4,
      }, [{
        messageElements: {element: 'DocString', expected: 4, actual: 2},
        rule: ruleName,
        location: {
          line: 5,
          column: 3,
        },
      }, {
        messageElements: {element: 'DocString line', expected: 4, actual: 2},
        rule: ruleName,
        location: {
          line: 14,
          column: 3,
        },
      }]);
    });
  });
});
