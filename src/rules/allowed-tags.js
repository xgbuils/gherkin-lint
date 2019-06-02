const rule = 'allowed-tags';
const objectRuleValidation = require('../config/object-rule-validation');
const {compose, intoArray} = require('../utils/generic');
const {filter, map} = require('../utils/transducers');

const {
  flatMapNodeTags,
} = require('../utils/gherkin');

const availableConfigs = {
  'tags': [],
};

const isNotAllowed = (allowedTags) => (tag) => allowedTags.indexOf(tag.name) === -1;

const createError = (node) => (tag) => ({
  type: 'rule',
  message: `Not allowed tag ${tag.name} on ${node.type}`,
  rule: rule,
  location: tag.location,
});

const checkTags = (predicate) => (node) => {
  return intoArray(compose(
    filter(predicate),
    map(createError(node))
  ))(node.tags);
};

function allowedTags({feature, config}) {
  const allowedTags = config.tags;
  const checkAllowedTags = checkTags(isNotAllowed(allowedTags));

  return flatMapNodeTags(checkAllowedTags)(feature);
}

module.exports = {
  name: rule,
  run: allowedTags,
  isValidConfig: objectRuleValidation(availableConfigs),
};
