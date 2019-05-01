const jsonFormatter = require('./json');
const stylishFormatter = require('./stylish');
const style = require('./helpers/style');
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
        style.boldError('Unsupported format. The supported formats are json and stylish.'),
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
