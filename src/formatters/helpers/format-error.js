const chalk = require('chalk');
const {flatMap} = require('../../utils/generic');

module.exports = ({errors = [], message}) => {
  return flatMap((lines) => lines)([
    message ? [chalk.bold.red(message)] : [],
    errors.map(({rule, message, type}) => {
      const wrongConfigMessage = type === 'config-rule-error'
        ? `Invalid rule configuration for "${rule}" - `
        : '';
      return chalk.red(`- ${wrongConfigMessage}${message}`);
    }),
  ]);
};
