const sortByLine = (errors) => errors.sort((a, b) => {
  return a.location.line - b.location.line;
});

const lintFiles = (files, rules, fileLinter) => {
  const outputPromise = files.reduce((errorsPromise, file) => {
    return errorsPromise.then((errors) => {
      return fileLinter.lint(file, rules).then((fileErrors) => {
        if (fileErrors.length > 0) {
          const fileBlob = {
            message: file.path,
            errors: sortByLine(fileErrors),
          };
          errors.push(fileBlob);
        }
        return errors;
      });
    });
  }, Promise.resolve([]));

  return outputPromise.then((output) => {
    return output.length > 0
      ? Promise.reject({
        type: 'lint-errors',
        errors: output,
      })
      : Promise.resolve({});
  });
};

class Linter {
  constructor(configProvider, rulesParser, featureProvider, fileLinter) {
    this.configProvider = configProvider;
    this.rulesParser = rulesParser;
    this.featureProvider = featureProvider;
    this.fileLinter = fileLinter;
  }

  lint() {
    const result = this.configProvider.provide()
      .then((config) => this.rulesParser.parse(config))
      .then((rules) => {
        return this.featureProvider.provide()
          .then((files) => lintFiles(files, rules, this.fileLinter));
      });
    return result;
  }
}

module.exports = Linter;
