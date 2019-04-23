const rule = 'no-trailing-spaces';

const trailingSpacesRegexp = /[\t ]+$/;

const createError = ([line, lineNo]) => ({
  type: 'rule',
  message: 'Trailing spaces are not allowed',
  rule: rule,
  location: {
    line: lineNo,
    column: line.length - line.match(trailingSpacesRegexp)[0].length + 1,
  },
});

const noTrailingSpaces = (unused, file) => {
  return file.lines.map((line, index) => [line, index + 1])
    .filter(([line, lineNo]) => trailingSpacesRegexp.test(line))
    .map(createError);
};

module.exports = {
  name: rule,
  run: noTrailingSpaces,
  isValidConfig: () => [],
};
