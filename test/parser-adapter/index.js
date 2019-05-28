const ParserAdapter = require('../../src/parser-adapter/');
const {expect} = require('chai');

describe('ParserAdapter', () => {
  context('gherkin 5.1', () => {
    it('given the parser, builds a normalized parser', () => {
      const language = 'en';
      const feature = {
        language,
        children: [],
      };
      const tree = {feature};
      const content = 'file content';
      const file = {content};
      const languageKeywords = ['Then', 'When', 'Given'];

      const Gherkin = {
        Parser: class Parser {
          parse(contentParam) {
            if (contentParam === content) {
              return tree;
            }
            throw new Error('wrong parsing');
          }
        },
        DIALECTS: {
          [language]: languageKeywords,
        },
      };

      const parser = ParserAdapter(Gherkin);
      return parser.parse(file).then((result) => {
        expect(result).to.be.deep.equal({
          feature,
          languageKeywords,
        });
      }, () => {
        expect.fail('parser must not fail');
      });
    });
  });
});
