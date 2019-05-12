module.exports = (Gherkin) => {
  const {DIALECTS, Parser} = Gherkin;
  const parser = new Parser();
  return {
    parse(content) {
      const {feature = {}} = parser.parse(content);
      return {
        languageKeywords: DIALECTS[feature.language],
        feature,
      };
    },
  };
};
