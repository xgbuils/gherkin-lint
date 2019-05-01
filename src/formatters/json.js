const parseError = ({type, message, rule, location}) => ({
  message,
  rule,
  line: location.line,
});

module.exports = {
  format(results) {
    return [JSON.stringify(results.map(({errors, filePath}) => {
      return {
        filePath,
        errors: errors.map(parseError),
      };
    }))];
  },
};
