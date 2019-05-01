const assert = require('chai').assert;
const formatterFactory = require('../../src/formatters/formatter-factory');

const lintFailures = {
  type: 'lint-errors',
  errors: [{
    message: 'path/to/file',
    filePath: 'path/to/file',
    errors: [{
      message: 'error message',
      location: {
        line: 3,
        column: 5,
      },
    }],
  }],
};

describe('Formatter factory', function() {
  it('Stylish formatter and linting errors', function() {
    const formatter = formatterFactory('stylish');
    const result = formatter.format(lintFailures);
    assert.deepEqual(result, [
      '\u001b[0;4mpath/to/file\u001b[24m',
      '  \u001b[38;5;243m\u001b[0m    error message    \u001b[38;5;243mundefined\u001b[0m',
      '\n',
    ]);
  });

  it('JSON formatter and linting errors', function() {
    const formatter = formatterFactory('json');
    const result = formatter.format(lintFailures);
    assert.deepEqual(result, [
      '[{"filePath":"path/to/file","errors":[{"message":"error message","line":3}]}]',
    ]);
  });

  it('JSON formatter and config rule errors', function() {
    const formatter = formatterFactory('json');
    const result = formatter.format({
      type: 'config-errors',
      message: 'error title',
      errors: [{
        type: 'config-rule-error',
        message: 'field not needed',
        rule: 'rule-name',
      }, {
        type: 'undefined-rule',
        message: 'rule does not exist',
        rule: 'another-rule',
      }],
    });
    assert.deepEqual(result, [
      '\u001b[31m\u001b[1merror title\u001b[0m',
      '\u001b[31m- Invalid rule configuration for "rule-name" - field not needed\u001b[0m',
      '\u001b[31m- rule does not exist\u001b[0m',
    ]);
  });

  it('no existing formatter and linting errors', function() {
    const formatter = formatterFactory('wrong');
    const result = formatter.format(lintFailures);
    assert.deepEqual(result, ['\u001b[31m\u001b[1mUnsupported format. The supported formats are json and stylish.\u001b[0m']);
  });
});
