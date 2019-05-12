const rule = 'no-homogenous-tags';
const {
  applyOver,
  compose,
  intoArray,
} = require('../utils/generic');
const {filter, map} = require('../utils/transducers');
const {getExamples, getScenarios} = require('../utils/selectors');
const {flatMapScenarios} = require('../utils/gherkin');

const groupTagsByName = (tags) => {
  return tags.reduce((set, {name}) => set.add(name), new Set());
};

const collectScenarioTagInfo = (info, {tags}) => {
  const scenarioTags = groupTagsByName(tags);
  return [...scenarioTags].reduce((info, name) => {
    return info.set(name, (info.get(name) || 0) + 1);
  }, info);
};

const createErrorByFeature = (feature, [parent, children]) => ([name, tagsInfo]) => {
  return {
    type: 'rule',
    message: `${name} tag is declared in each ${children}.` +
      ` It could be defined at ${parent} level.`,
    rule: rule,
    location: feature.location,
  };
};

const noHomogenousTags = (getNodes, labels) => (feature) => {
  const createError = createErrorByFeature(feature, labels);
  const scenarios = getNodes(feature);
  const tagsInfo = scenarios.reduce(collectScenarioTagInfo, new Map());
  const {length} = scenarios;
  return intoArray(compose(
    filter(([name, times]) => times === length),
    map(createError)
  ))([...tagsInfo]);
};

const run = applyOver([
  noHomogenousTags(getScenarios, ['feature', 'scenario']),
  flatMapScenarios(noHomogenousTags(getExamples, ['scenario', 'example'])),
]);

module.exports = {
  name: rule,
  run: ({feature}) => run(feature),
  isValidConfig: () => [],
};
