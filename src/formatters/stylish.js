const {compose, intoArray} = require('../utils/generic');
const {flatMap} = require('../utils/transducers');
const chalk = require('chalk');

const stylizeRuleErrorWith = (maxErrorMsgLength, maxLineChars) => (error) => {
  let str = '  '; // indent 2 spaces so it looks pretty
  const padding = '    '; // padding of 4 spaces, will be used between line numbers, error msgs and rule names
  let {line} = error.location;
  line = line.toString();

  // add spaces until the line string is as long as our longest line string
  while (line.length < maxLineChars) {
    line += ' ';
  }

  // print the line number as gray
  str += chalk.gray(line) + padding;

  let errorMsg = error.message;

  // add spaces until the message is as long as our longest error message
  while (errorMsg.length < maxErrorMsgLength) {
    errorMsg += ' ';
  }

  // print the error message in default color and add 2 spaces after it for readability
  str += errorMsg + padding;

  // print the rule name in gray
  str += chalk.gray(error.rule);
  // lastly, return our stylish-est string and pretend that this code was never written
  return str;
};

function stylizeFilePath(filePath) {
  return chalk.underline(filePath);
}

function getMaxLengthOfField({errors}, selector) {
  let length = 0;
  errors.filter((error) => selector(error))
    .forEach(function(error) {
      const errorStr = selector(error).toString();
      if (errorStr.length > length) {
        length = errorStr.length;
      }
    });
  return length;
}

const stylizeResult = (result) => {
  const maxErrorMsgLength = getMaxLengthOfField(result, getMessage);
  const maxLineChars = getMaxLengthOfField(result, getLine);
  const stylizeRuleError = stylizeRuleErrorWith(maxErrorMsgLength, maxLineChars);

  const {errors} = result;
  return [
    [stylizeFilePath(result.message)],
    errors.map(stylizeRuleError),
    ['\n'],
  ];
};

const getMessage = ({message}) => message;
const getLine = ({location}) => location.line;

function format(results) {
  return intoArray(compose(
    flatMap((result) => stylizeResult(result)),
    flatMap((lines) => lines)
  ))(results);
}

module.exports = {
  format,
};
