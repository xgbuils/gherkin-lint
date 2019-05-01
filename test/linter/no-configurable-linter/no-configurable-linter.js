const assert = require('chai').assert;
const fs = require('fs');
const NoConfigurableLinter = require('../../../src/linter/no-configurable-linter.js');
const Gherkin = require('gherkin');
const parser = new Gherkin.Parser();
const linter = new NoConfigurableLinter(parser);
const createFile = (fileName) => ({
  content: fs.readFileSync(
    `test/linter/no-configurable-linter/${fileName}`,
    'utf-8'
  ),
});

const parsedFeature = {
  name: 'feature name',
  children: [],
};

const successfulParser = {
  parse() {
    return {
      feature: parsedFeature,
    };
  },
};

describe('No Configurable File Linter', function() {
  it('detects up-to-one-background-per-file violations', function() {
    const result = linter.lint(createFile('MultipleBackgrounds.feature'));
    const expected = [{
      location: {
        line: 9,
        column: 1,
      },
      message: 'Multiple "Background" definitions in the same file are disallowed',
      rule: 'up-to-one-background-per-file',
    }];
    assert.deepEqual(result.getFailures(), expected);
  });

  it('detects no-tags-on-backgrounds violations', function() {
    const result = linter.lint(createFile('TagOnBackground.feature'));
    const expected = [{
      location: {
        line: 4,
        column: 1,
      },
      message: 'Tags on Backgrounds are dissallowed',
      rule: 'no-tags-on-backgrounds',
    }];
    assert.deepEqual(result.getFailures(), expected);
  });

  it('detects one-feature-per-file violations', function() {
    const result = linter.lint(createFile('MultipleFeatures.feature'));
    const expected = [{
      location: {
        line: 7,
        column: 1,
      },
      message: 'Multiple "Feature" definitions in the same file are disallowed',
      rule: 'one-feature-per-file',
    }];
    assert.deepEqual(result.getFailures(), expected);
  });

  it('detects no-multiline-steps violations', function() {
    const result = linter.lint(createFile('MultilineStep.feature'));
    const expected = [{
      location: {
        line: 9,
        column: 6,
      },
      message: 'Steps should begin with "Given", "When", "Then", "And" or "But". Multiline steps are dissallowed',
      rule: 'no-multiline-steps',
    }];
    assert.deepEqual(result.getFailures(), expected);
  });

  it('detects no-multiline-steps violations in backgrounds', function() {
    const result = linter.lint(createFile('MultilineBackgroundStep.feature'));
    const expected = [{
      location: {
        line: 5,
        column: 5,
      },
      message: 'Steps should begin with "Given", "When", "Then", "And" or "But". Multiline steps are dissallowed',
      rule: 'no-multiline-steps',
    }];
    assert.deepEqual(result.getFailures(), expected);
  });

  it('detects no-multiline-steps violations in scenario outlines', function() {
    const result = linter.lint(createFile('MultilineScenarioOutlineStep.feature'));
    const expected = [{
      location: {
        line: 9,
        column: 6,
      },
      message: 'Steps should begin with "Given", "When", "Then", "And" or "But". Multiline steps are dissallowed',
      rule: 'no-multiline-steps',
    }];
    assert.deepEqual(result.getFailures(), expected);
  });

  it('detects multiline scenario and multiple features errors', function() {
    const result = linter.lint(createFile('MultilineStepAndTwoFeatures.feature'));
    const expected = [{
      location: {
        line: 9,
        column: 5,
      },
      message: 'Steps should begin with "Given", "When", "Then", "And" or "But". Multiline steps are dissallowed',
      rule: 'no-multiline-steps',
    }, {
      location: {
        line: 15,
        column: 1,
      },
      message: 'Multiple "Feature" definitions in the same file are disallowed',
      rule: 'one-feature-per-file',
    }];
    assert.deepEqual(result.getFailures(), expected);
  });

  it('detects no-examples-in-scenarios violations', function() {
    const result = linter.lint(createFile('ExampleInScenario.feature'));
    const expected = [{
      location: {
        line: 6,
        column: 1,
      },
      message: 'Cannot use "Examples" in a "Scenario", use a "Scenario Outline" instead',
      rule: 'no-examples-in-scenarios',
    }];
    assert.deepEqual(result.getFailures(), expected);
  });

  it('detects additional violations that happen after the "no-tags-on-backgrounds" rule', function() {
    const result = linter.lint(createFile('TagOnBackgroundAndMultilineStep.feature'));
    const expected = [{
      location: {
        line: 4,
        column: 3,
      },
      message: 'Tags on Backgrounds are dissallowed',
      rule: 'no-tags-on-backgrounds',
    }, {
      location: {
        line: 13,
        column: 6,
      },
      message: 'Steps should begin with "Given", "When", "Then", "And" or "But". Multiline steps are dissallowed',
      rule: 'no-multiline-steps',
    }];
    assert.deepEqual(result.getFailures(), expected);
  });

  it('detects additional violations that happen after the "one-feature-per-file violations" rule', function() {
    const result = linter.lint(createFile('MultipleBackgroundsWithTags.feature'));
    const expected = [{
      location: {
        line: 4,
        column: 3,
      },
      message: 'Tags on Backgrounds are dissallowed',
      rule: 'no-tags-on-backgrounds',
    }];
    assert.deepEqual(result.getFailures(), expected);
  });

  it('correctly parses files that have the correct Gherkin format', function() {
    const noConfigurableLinter = new NoConfigurableLinter(successfulParser);
    const file = {
      filePath: 'path/to/file',
      content: '',
    };
    const result = noConfigurableLinter.lint(file);
    assert.equal(result.isSuccess(), true);
    assert.deepEqual(result.getSuccesses(), [{
      feature: parsedFeature,
      file,
    }]);
  });

  it('parser throws an error with unexpected error message', () => {
    const error = {
      message: 'unexpected error',
    };
    const e = {
      errors: [error],
    };
    const wrongParser = {
      parse() {
        throw e;
      },
    };
    const wrongLinter = new NoConfigurableLinter(wrongParser);
    const result = wrongLinter.lint(createFile('ExampleInScenario.feature'));
    assert.deepEqual(result.getFailures(), [{
      rule: 'unexpected-error',
      message: error.message,
      location: {},
    }]);
  });

  it('parser throws an error without errors property', () => {
    const error = 'error';
    const wrongParser = {
      parse() {
        throw error;
      },
    };
    const wrongLinter = new NoConfigurableLinter(wrongParser);
    const test = () => wrongLinter.lint(createFile('ExampleInScenario.feature'));
    assert.throws(test, error);
  });
});
