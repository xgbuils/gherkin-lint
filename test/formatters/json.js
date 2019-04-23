const assert = require('chai').assert;
const {format} = require('../../src/formatters/json');

describe('JSON formatter', function() {
  it('formats config rule errors', function() {
    const actual = format([{
      type: 'config-errors',
      message: 'error title',
      errors: [{
        type: 'config-rule-error',
        message: 'field not needed',
        rule: 'rule-name',
        location: {
          line: 1,
          column: 2,
        },
      }, {
        type: 'undefined-rule',
        message: 'rule does not exist',
        rule: 'another-rule',
        location: {
          line: 3,
          column: 4,
        },
      }],
    }]);
    assert.deepEqual(actual, ['[{"type":"config-errors","message":"error title","errors":[{"type":"config-rule-error","message":"field not needed","rule":"rule-name","line":1},{"type":"undefined-rule","message":"rule does not exist","rule":"another-rule","line":3}]}]']);
  });
});
