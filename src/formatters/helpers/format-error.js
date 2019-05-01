const style = require('./style');
const {flatMap} = require('../../utils/generic');

module.exports = ({errors = [], message}) => {
  return flatMap((lines) => lines)([
    message ? [style.boldError(message)] : [],
    errors.map(({rule, message, type}) => {
      const wrongConfigMessage = type === 'config-rule-error'
        ? `Invalid rule configuration for "${rule}" - `
        : '';
      return style.error(`- ${wrongConfigMessage}${message}`);
    }),
  ]);
};
