const rule = 'no-homogenous-tags';
const {
  compose,
  intoArray,
} = require('../utils/generic');
const {filter, map} = require('../utils/transducers');
const {getScenarios} = require('../utils/selectors');

const groupTagsByName = (tags) => {
  return tags.reduce((set, {name}) => set.add(name), new Set());
};

const collectScenarioTagInfo = (info, {tags}) => {
  const scenarioTags = groupTagsByName(tags);
  return [...scenarioTags].reduce((info, name) => {
    return info.set(name, (info.get(name) || 0) + 1);
  }, info);
};

const createErrorByFeature = (feature) => ([name, tagsInfo]) => {
  return {
    type: 'rule',
    message: `${name} tag is declared in each scenario.` +
      ' It could be defined at feature level.',
    rule: rule,
    location: feature.location,
  };
};

const noHomogenousTags = (feature) => {
  const createError = createErrorByFeature(feature);
  const scenarios = getScenarios(feature);
  const tagsInfo = scenarios.reduce(collectScenarioTagInfo, new Map());
  const {length} = scenarios;
  return intoArray(compose(
    filter(([name, times]) => times === length),
    map(createError)
  ))([...tagsInfo]);
};

module.exports = {
  name: rule,
  run: noHomogenousTags,
  isValidConfig: () => [],
};
