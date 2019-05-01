const assert = require('chai').assert;
const {format} = require('../../src/formatters/json');

describe('JSON formatter', function() {
  it('formats config rule errors', function() {
    const actual = format([{
      type: 'lint-errors',
      filePath: 'path/to/file',
      errors: [{
        message: 'wrong style',
        rule: 'rule-name',
        location: {
          line: 1,
          column: 2,
        },
      }, {
        message: 'tags not found',
        rule: 'another-rule',
        location: {
          line: 3,
          column: 4,
        },
      }],
    }]);
    assert.deepEqual(actual, ['[{"filePath":"path/to/file","errors":[{"message":"wrong style","rule":"rule-name","line":1},{"message":"tags not found","rule":"another-rule","line":3}]}]']);
  });
});
