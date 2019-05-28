module.exports = (Gherkin) => {
  const {Parser, DIALECTS} = Gherkin;
  const parser = new Parser();
  return {
    parse({content}) {
      const {feature = {}} = parser.parse(content);
      return Promise.resolve({
        languageKeywords: DIALECTS[feature.language],
        feature,
      });
    },
  };
};
