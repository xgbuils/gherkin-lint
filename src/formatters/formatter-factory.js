const chalk = require('chalk');
const jsonFormatter = require('./json');
const stylishFormatter = require('./stylish');
const formatError = require('./helpers/format-error');
const defaults = require('../defaults');

const lintFormatterFactory = (format) => {
  if (format === 'json') {
    return jsonFormatter;
  } else if (format === 'stylish') {
    return stylishFormatter;
  }
  return {
    format() {
      return [
        chalk.bold.red('Unsupported format. The supported formats are json and stylish.'),
      ];
    },
  };
};

module.exports = (format = defaults.format) => {
  const lintFormatter = lintFormatterFactory(format);
  return {
    format(result) {
      if (result.type === 'lint-errors') {
        return lintFormatter.format(result.errors);
      }
      return formatError(result);
    },
  };
};
