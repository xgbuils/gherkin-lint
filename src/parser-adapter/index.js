module.exports = (Gherkin) => {
  if (Gherkin.Parser) {
    const {Parser, DIALECTS} = Gherkin;
    const parser = new Parser();
    return {
      parse({content}) {
        try {
          const {feature = {}} = parser.parse(content);
          return Promise.resolve({
            languageKeywords: DIALECTS[feature.language],
            feature,
          });
        } catch (error) {
          return Promise.reject(error);
        }
      },
    };
  } else {
    const {fromPaths} = Gherkin;
    return {
      parse({path}) {
        const stream = fromPaths([path], {
          includeSource: false,
          includePickles: false,
        });

        return new Promise((resolve, reject) => {
          const gherkinDocuments = [];
          const errors = [];
          stream.on('error', (error) => {
            reject(error);
          });
          stream.on('data', ({gherkinDocument, attachment}) => {
            if (attachment) {
              errors.push(attachment);
            } else {
              gherkinDocuments.push(gherkinDocument);
            }
          });
          stream.on('end', () => {
            if (errors.length > 0) {
              reject(errors);
            } else if (gherkinDocuments.length > 1) {
              reject(new Error(
                'Unexpected error: fromPaths function returns multiple gherkin documents'
              ));
            } else if (gherkinDocuments.length === 1) {
              const [gherkinDocument] = gherkinDocuments;
              resolve(gherkinDocument);
            } else {
              reject(new Error('Unexpected error: zero gherkin documents'));
            }
          });
        });
      },
    };
  }
};
