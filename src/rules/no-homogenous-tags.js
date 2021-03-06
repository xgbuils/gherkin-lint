const rule = 'no-homogenous-tags';
const {
  compose,
  intoArray,
  reduce,
  uniq,
} = require('../utils/generic');
const {filter, map} = require('../utils/transducers');
const {getFeatureNodes} = require('../utils/selectors');
const {filterScenarios} = require('../utils/gherkin');

const countTags = (tagStatistics, tagsNames) => {
  return tagsNames.reduce((tagStatistics, tagName) => {
    return tagStatistics.set(tagName, (tagStatistics.get(tagName) || 0) + 1);
  }, tagStatistics);
};

const noHomogenousTags = (feature) => {
  const scenarios = intoArray(filterScenarios)(getFeatureNodes(feature));
  const {length} = scenarios;
  const tagStatistics = reduce(compose(
    map(({tags}) => tags.map(({name}) => name)),
    map((tagNames) => uniq(tagNames))
  )(countTags), new Map())(scenarios);

  const homogenousTags = intoArray(compose(
    filter(([tagName, times]) => times === length),
    map(([tagName]) => tagName)
  ))([...tagStatistics]);

  const homogenousTagsReport = homogenousTags.join(', ');
  return homogenousTagsReport ? [{
    type: 'rule',
    message: 'All Scenarios on this Feature have the same tag(s), they' +
      ` should be defined on the Feature instead: ${homogenousTagsReport}`,
    rule: rule,
    location: feature.location,
  }] : [];
};

module.exports = {
  name: rule,
  run: noHomogenousTags,
  isValidConfig: () => [],
};
