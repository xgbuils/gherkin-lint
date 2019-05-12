const rule = 'no-superfluous-tags';
const {applyOver, compose, flatMap} = require('../utils/generic');
const {getExamples, getScenarios} = require('../utils/selectors');

const getTagName = ({name}) => name;

const typesMap = {
  Feature: 'feature',
  ScenarioOutline: 'scenario',
};

const getNodeTagNames = ({tags, type}) => ({
  names: new Set(tags.map(getTagName)),
  type: typesMap[type],
});

const createErrors = (usedTags) => (tag) => {
  const {type} = usedTags.find(({names}) => names.has(tag.name)) || {};
  return type ? [{
    type: 'rule',
    message: `${tag.name} tag is already used at ${type} level`,
    rule: rule,
    location: tag.location,
  }] : [];
};

const checkSuperfluousTags = (usedTags) => (node) => {
  return flatMap(createErrors(usedTags))(node.tags);
};

const noSuperfluousScenarioTags = (featureTags) => (scenario) => {
  const usedTags = [featureTags].concat(getNodeTagNames(scenario));
  return applyOver([
    checkSuperfluousTags([featureTags]),
    compose(flatMap(checkSuperfluousTags(usedTags)), getExamples),
  ])(scenario);
};

const noSuperfluousTags = ({feature}) => {
  const featureTags = getNodeTagNames(feature);
  return flatMap(noSuperfluousScenarioTags(featureTags))(getScenarios(feature));
};

module.exports = {
  name: rule,
  run: noSuperfluousTags,
  isValidConfig: () => [],
};
