const ParserAdapter = require('../../src/parser-adapter/');
const {expect} = require('chai');
const sinon = require('sinon');
// const Gherkin = require('gherkin');

describe('ParserAdapter', () => {
  describe('gherkin 5.1', () => {
    const createGherkin5 = (parse, DIALECTS = {}) => {
      const Parser = function() {};
      Parser.prototype.parse = parse;
      return {Parser, DIALECTS};
    };

    context('passed a file object with content prop', () => {
      it('receives the content prop as parameter', () => {
        const parse = sinon.fake.returns({});
        const Gherkin = createGherkin5(parse);

        const content = 'file content';
        const file = {content};
        const parser = ParserAdapter(Gherkin);

        return parser.parse(file).then(() => {
          sinon.assert.calledOnce(parse);
          sinon.assert.calledWithExactly(parse, content);
        }, () => {
          expect.fail('parser must not fail');
        });
      });
    });

    context('parser method returns a well-formed gherkin document', () => {
      it('parse method resolves a well-formed parsed feature', () => {
        const language = 'en';
        const languageKeywords = ['Then', 'When', 'Given'];
        const feature = {language};
        const parse = sinon.fake.returns({feature});
        const Gherkin = createGherkin5(parse, {
          [language]: languageKeywords,
        });

        const parser = ParserAdapter(Gherkin);
        return parser.parse({}).then((result) => {
          expect(result).to.be.deep.equal({
            feature,
            languageKeywords,
          });
        }, () => {
          expect.fail('parser must not fail');
        });
      });
    });

    context('parser method throws an error', () => {
      it('parse method rejects the error', () => {
        const error = new Error('error');
        const parse = () => {
          throw error;
        };
        const Gherkin = createGherkin5(parse);

        const parser = ParserAdapter(Gherkin);
        return parser.parse({}).then(() => {
          expect.fail('parser must fail');
        }, (actualError) => {
          expect(actualError).to.be.equal(error);
        });
      });
    });
  });

  describe('gherkin 6.0', () => {
    const successfulStream = (data) => ({
      on(event, cb) {
        if (event === 'data') {
          const items = Array.isArray(data) ? data : [data];
          items.forEach(cb);
        } else if (event === 'end') {
          cb();
        }
      },
    });
    context('passed an object with a path prop', () => {
      it('receives a singleton array with the path as parameter', () => {
        const fromPaths = sinon.fake.returns(successfulStream({}));
        const Gherkin = {fromPaths};
        const path = 'path/to/file.feature';

        const parser = ParserAdapter(Gherkin);
        return parser.parse({path}).then((e) => {
          sinon.assert.calledOnce(fromPaths);
          const [[firstArg, secondArg]] = fromPaths.args;
          expect(firstArg).to.be.deep.equal([path]);
          expect(secondArg).to.be.deep.equal({
            includeSource: false,
            includePickles: false,
          });
        });
      });
    });

    context('fromPaths method returns an stream that dispatch a well-formed gherkin document', () => {
      it('parse method resolves a well-formed parsed feature', () => {
        const gherkinDocument = {
          feature: {
            tags: [],
            children: [],
          },
        };
        const fromPaths = sinon.fake.returns(successfulStream({
          gherkinDocument,
        }));
        const Gherkin = {fromPaths};

        const parser = ParserAdapter(Gherkin);
        return parser.parse({}).then((result) => {
          expect(result).to.be.equal(gherkinDocument);
        }, () => {
          expect.fail('parser must not fail');
        });
      });
    });

    context('fromPaths method returns an stream that dispatch a multiple attachments', () => {
      it('parse method rejects an array of attachments', () => {
        const firstAttachment = {
          source: {uri: 'path/to/first'},
          data: 'first error',
        };
        const secondAttachment = {
          source: {uri: 'path/to/second'},
          data: 'second error',
        };
        const attachments = [{
          attachment: firstAttachment,
        }, {
          attachment: secondAttachment,
        }];
        const fromPaths = sinon.fake.returns(successfulStream(attachments));
        const Gherkin = {fromPaths};

        const parser = ParserAdapter(Gherkin);
        return parser.parse({}).then(() => {
          expect.fail('parser must fail');
        }, (errors) => {
          expect(errors).to.be.deep.equal([
            firstAttachment,
            secondAttachment,
          ]);
        });
      });
    });

    context('fromPaths method returns an stream that dispatch a multiple gherkin document', () => {
      it('parse method rejects with unexpected error', () => {
        const firstGherkinDocument = {
          feature: {
            tags: [{name: '@tag'}],
            children: [],
          },
        };
        const secondGherkinDocument = {
          feature: {
            children: [],
          },
        };
        const gherkinDocuments = [{
          gherkinDocument: firstGherkinDocument,
        }, {
          gherkinDocument: secondGherkinDocument,
        }];
        const fromPaths = sinon.fake.returns(successfulStream(gherkinDocuments));
        const Gherkin = {fromPaths};

        const parser = ParserAdapter(Gherkin);
        return parser.parse({}).then(() => {
          expect.fail('parser must fail');
        }, (error) => {
          expect(error.message).to.be.equal(
            'Unexpected error: fromPaths function returns multiple gherkin documents'
          );
        });
      });
    });

    context('fromPaths method returns an stream that does not dispatch gherkin documents', () => {
      it('parse method rejects with unexpected error', () => {
        const fromPaths = sinon.fake.returns(successfulStream([]));
        const Gherkin = {fromPaths};

        const parser = ParserAdapter(Gherkin);
        return parser.parse({}).then(() => {
          expect.fail('parser must fail');
        }, (error) => {
          expect(error.message).to.be.equal(
            'Unexpected error: zero gherkin documents'
          );
        });
      });
    });

    context('fromPaths method dispatch an error', () => {
      it('parse method rejects with unexpected error', () => {
        const error = new Error('error');
        const fromPaths = sinon.fake.returns({
          on(event, cb) {
            if (event === 'error') {
              cb(error);
            } else if (event === 'end') {
              cb();
            }
          },
        });
        const Gherkin = {fromPaths};

        const parser = ParserAdapter(Gherkin);
        return parser.parse({}).then(() => {
          expect.fail('parser must fail');
        }, (actualError) => {
          expect(actualError).to.be.equal(error);
        });
      });
    });
  });
});
