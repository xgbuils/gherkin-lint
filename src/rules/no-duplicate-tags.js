const rule = 'no-duplicate-tags';
const {flatMapNodeTags} = require('../utils/gherkin');

const appendErrors = (track, tag) => {
  if (track.names.has(tag.name)) {
    track.errors.push(createError(tag));
  } else {
    track.names.add(tag.name);
  }
  return track;
};

const createError = (tag) => ({
  type: 'rule',
  message: `Duplicate tags are not allowed: ${tag.name}`,
  rule: rule,
  location: tag.location,
});

const verifyTags = ({tags, location}) => {
  return tags.reduce(appendErrors, {
    names: new Set(),
    errors: [],
  }).errors;
};

module.exports = {
  name: rule,
  run: ({feature}) => flatMapNodeTags(verifyTags)(feature),
  isValidConfig: () => [],
};
