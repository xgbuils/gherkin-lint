const assert = require('chai').assert;
const formatterFactory = require('../../src/formatters/formatter-factory');
const {boldError, gray, error, underline} = require('../../src/formatters/helpers/style');

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
      underline('path/to/file'),
      `  ${gray('3')}    error message    ${gray(undefined)}`,
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
      boldError('error title'),
      error('- Invalid rule configuration for "rule-name" - field not needed'),
      error('- rule does not exist'),
    ]);
  });

  it('no existing formatter and linting errors', function() {
    const formatter = formatterFactory('wrong');
    const result = formatter.format(lintFailures);
    assert.deepEqual(result, [boldError('Unsupported format. The supported formats are json and stylish.')]);
  });
});
