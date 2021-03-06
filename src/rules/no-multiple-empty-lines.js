const rule = 'no-multiple-empty-lines';

const isEmptyLine = (line) => line !== undefined ? line.trim() === '' : false;
const isMultipleEmptyLines =
  ([lines, index]) => isEmptyLine(lines[index]) && isEmptyLine(lines[index + 1]);

const createError = ([lines, index]) => ({
  type: 'rule',
  message: 'Multiple empty lines are not allowed',
  rule: rule,
  location: {
    line: index + 2,
    column: 1,
  },
});

const noMulitpleEmptyLines = (unused, file) => {
  const {lines} = file;
  return lines.map((unused, index) => [lines, index])
    .filter(isMultipleEmptyLines)
    .map(createError);
};

module.exports = {
  name: rule,
  run: noMulitpleEmptyLines,
  isValidConfig: () => [],
};
