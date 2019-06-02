const expect = require('chai').expect;
const Linter = require('../../src/linter/');

const firstNameFeature = 'first.feature';
const secondNameFeature = 'second.feature';
const pathToFirstFeature = `path/to/${firstNameFeature}`;
const pathToSecondFeature = `path/to/${secondNameFeature}`;

const configProviderFailure = {
  type: 'config-error',
  message: 'config error',
};

const successfulConfigProvider = {
  provide() {
    return Promise.resolve({});
  },
};

const failedConfigProvider = {
  provide() {
    return Promise.reject(configProviderFailure);
  },
};

const rulesParserFailure = {
  type: 'config-error',
  message: 'Error in configuration file:',
  errors: [{
    message: 'one error',
  }],
};

const successfulRulesParser = {
  parse() {
    return Promise.resolve({});
  },
};

const failedRulesParser = {
  parse() {
    return Promise.reject(rulesParserFailure);
  },
};

const featureFinderFailure = {
  message: 'feature not found',
};

const firstFile = {
  name: firstNameFeature,
  path: pathToFirstFeature,
};

const secondFile = {
  name: secondNameFeature,
  path: pathToSecondFeature,
};

const successfulFeatureFinder = {
  provide() {
    return Promise.resolve([firstFile, secondFile]);
  },
};

const failedFeatureFinder = {
  provide() {
    return Promise.reject(featureFinderFailure);
  },
};

const createSuccessfulFileLinter = (config = {}) => ({
  lint(file) {
    return Promise.resolve(config[file.name] || []);
  },
});

describe('Linter', () => {
  describe('lint', () => {
    context('when config provider fails', () => {
      it('returns config provider errors', () => {
        const linter = new Linter(
          failedConfigProvider,
          successfulRulesParser,
          successfulFeatureFinder,
          createSuccessfulFileLinter()
        );

        return linter.lint().then(() => {
          expect.fail('linter must fail');
        }, (result) => {
          expect(result).to.be.equal(configProviderFailure);
        });
      });
    });

    context('when rules parser fails', () => {
      it('returns config provider errors', () => {
        const linter = new Linter(
          successfulConfigProvider,
          failedRulesParser,
          successfulFeatureFinder,
          createSuccessfulFileLinter()
        );

        return linter.lint().then(() => {
          expect.fail('linter must fail');
        }, (result) => {
          expect(result).to.be.equal(rulesParserFailure);
        });
      });
    });

    context('when feature finder fails', () => {
      it('returns config provider errors', () => {
        const linter = new Linter(
          successfulConfigProvider,
          successfulRulesParser,
          failedFeatureFinder,
          createSuccessfulFileLinter()
        );

        return linter.lint().then(() => {
          expect.fail('linter must fail');
        }, (result) => {
          expect(result).to.be.equal(featureFinderFailure);
        });
      });
    });

    context('fileLinter returns errors', () => {
      it('returns the errors of each file', () => {
        const errorsFirstFeature = [{
          message: 'error 1',
          location: {
            line: 2,
            column: 4,
          },
        }, {
          message: 'error 2',
          location: {
            line: 5,
            column: 3,
          },
        }];
        const errorsSecondFeature = [];
        const linter = new Linter(
          successfulConfigProvider,
          successfulRulesParser,
          successfulFeatureFinder,
          createSuccessfulFileLinter({
            [firstNameFeature]: errorsFirstFeature,
            [secondNameFeature]: errorsSecondFeature,
          })
        );

        return linter.lint().then((result) => {
          expect(result).to.be.deep.equal({
            type: 'lint-errors',
            errors: [{
              message: firstFile.path,
              errors: errorsFirstFeature,
            }],
          });
        }, () => {
          expect.fail('linter must not fail');
        });
      });
    });

    context('fileLinter does not return errors', () => {
      it('returns an empty array', () => {
        const linter = new Linter(
          successfulConfigProvider,
          successfulRulesParser,
          successfulFeatureFinder,
          createSuccessfulFileLinter({
            [firstNameFeature]: [],
            [secondNameFeature]: [],
          })
        );

        return linter.lint().then((result) => {
          expect(result).to.be.deep.equal({});
        }, () => {
          expect.fail('linter must not fail');
        });
      });
    });
  });
});
