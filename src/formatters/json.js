const parseError = ({type, message, rule, location}) => ({
  type,
  message,
  rule,
  line: location.line,
});

module.exports = {
  format(results) {
    return [JSON.stringify(results.map((resultFile) => {
      return Object.assign({}, resultFile, resultFile.errors ? {
        errors: resultFile.errors.map(parseError),
      } : {});
    }))];
  },
};
