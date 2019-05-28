const ruleName = 'new-line-at-eof';
const ruleTestBase = require('../rule-test-base');
const rule = require('../../../src/rules/new-line-at-eof.js');
const LINE_IS_REQUIRED = 'New line at EOF(end of file) is required';
const LINE_IS_FORBIDDEN = 'New line at EOF(end of file) is not allowed';
const runTest = ruleTestBase.createRuleTest(rule);

describe('New Line At EOF Rule', () => {
  it('detects an error when property is not "yes" or "no"', () => {
    return runTest('new-line-at-eof/NewLineAtEOF.feature', 'maybe', {
      message: 'Error(s) in configuration file:',
      type: 'config-error',
      errors: [{
        type: 'config-rule-error',
        rule: ruleName,
        message: 'The rule does not have the specified configuration option "maybe"',
      }],
    });
  });

  context('"yes" configuration', () => {
    it('doesn\'t raise errors when there are new line at eof', () => {
      return runTest('new-line-at-eof/NewLineAtEOF.feature', 'yes', []);
    });

    it('raises error when there are no new line at eof', () => {
      return runTest('new-line-at-eof/NoNewLineAtEOF.feature', 'yes', [{
        message: LINE_IS_REQUIRED,
        rule: ruleName,
        location: {
          line: 7,
          column: 1,
        },
      }]);
    });
  });

  context('"no" configuration', () => {
    it('raises error when there are new line at eof', () => {
      return runTest('new-line-at-eof/NewLineAtEOF.feature', 'no', [{
        message: LINE_IS_FORBIDDEN,
        rule: ruleName,
        location: {
          line: 8,
          column: 1,
        },
      }]);
    });

    it('doesn\'t raise error when there are no new line at eof', () => {
      return runTest('new-line-at-eof/NoNewLineAtEOF.feature', 'no', []);
    });
  });
});
