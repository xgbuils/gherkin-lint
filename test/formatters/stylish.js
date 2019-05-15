const assert = require('chai').assert;
const {format} = require('../../src/formatters/stylish');
const {gray, underline} = require('chalk');

describe('Stylish formatter', () => {
  it('formats lint failures', () => {
    const actual = format([{
      type: 'lint-failures',
      message: 'path/to/file',
      errors: [{
        message: 'weird error message',
        location: {
          line: 2,
          column: 5,
        },
        rule: 'rule-name',
      }, {
        message: 'extra large message error extra large message error',
        rule: 'another-rule',
        location: {
          line: 8,
          column: 3,
        },
      }, {
        message: 'a',
        location: {
          line: 12,
          column: 2,
        },
        rule: 'weird-rule',
      }],
    }]);
    assert.deepEqual(actual, [
      underline('path/to/file'),
      `  ${gray('2 ')}    weird error message                                    ${gray('rule-name')}`,
      `  ${gray('8 ')}    extra large message error extra large message error    ${gray('another-rule')}`,
      `  ${gray('12')}    a                                                      ${gray('weird-rule')}`,
      '\n',
    ]);
  });
});
