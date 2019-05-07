const rule = 'no-superfluous-tags';
const {compose, intoArray} = require('../utils/generic');
const {filter, flatMap, map} = require('../utils/transducers');
const {getFeatureNodes} = require('../utils/selectors');
const {filterScenarios} = require('../utils/gherkin');

const getTagName = ({name}) => name;

const createError = (tag) => {
  return {
    type: 'rule',
    message: `${tag.name} tag is already used at Feature level`,
    rule: rule,
    location: tag.location,
  };
};

const noSuperfluousTags = (feature) => {
  const featureTags = new Set(feature.tags.map(getTagName));
  return intoArray(compose(
    filterScenarios,
    flatMap(({tags}) => tags),
    filter(({name}) => featureTags.has(name)),
    map(createError)
  ))(getFeatureNodes(feature));
};

module.exports = {
  name: rule,
  run: noSuperfluousTags,
  isValidConfig: () => [],
};
