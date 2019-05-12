const rule = 'new-line-at-eof';
const stringRuleValidation = require('../config-validation/string-rule-validation');

const availableConfigs = [
  'yes',
  'no',
];

const newLineAtEOF = ({file, config}) => {
  const hasNewLineAtEOF = file.lines.slice(-1)[0] === '';
  let errormsg = '';
  if (hasNewLineAtEOF && config === 'no') {
    errormsg = 'New line at EOF(end of file) is not allowed';
  } else if (!hasNewLineAtEOF && config === 'yes') {
    errormsg = 'New line at EOF(end of file) is required';
  }

  return errormsg !== '' ? [{
    type: 'rule',
    message: errormsg,
    rule: rule,
    location: {
      line: file.lines.length,
      column: 1,
    },
  }] : [];
};

module.exports = {
  name: rule,
  run: newLineAtEOF,
  isValidConfig: stringRuleValidation(availableConfigs),
};
