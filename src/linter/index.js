const {flatten} = require('../utils/generic');

const sortByLine = (errors) => errors.sort((a, b) => {
  return a.location.line - b.location.line;
});

const lintFileWith = (fileLinter, rules) => (file) => {
  return fileLinter.lint(file, rules).then((fileErrors) => {
    return fileErrors.length > 0 ? [{
      message: file.path,
      errors: sortByLine(fileErrors),
    }] : [];
  });
};

const lintFiles = (files, rules, fileLinter) => {
  const lintFile = lintFileWith(fileLinter, rules);
  const outputPromise = Promise.all(files.map(lintFile))
    .then(flatten);

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
