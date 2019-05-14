const rule = 'one-space-between-tags';
const {flatMap} = require('../utils/generic');
const {flatMapNodeTags} = require('../utils/gherkin');

const groupTagsPerLine = require('../utils/group-tags-per-line');

const distance = (tag1, tag2) => {
  if (!tag2) {
    return 1;
  }
  return tag2.location.column - tag1.location.column - tag1.name.length;
};

const createError = ([dist, tag, nextTag]) => ({
  type: 'rule',
  location: {
    line: tag.location.line,
    column: tag.location.column + tag.name.length,
  },
  rule: rule,
  message: 'There is more than one space between the tags ' +
    tag.name + ' and ' + nextTag.name,
});

const collectErrorsPerLine = (tags) => {
  return tags.map((tag, index, tags) => {
    const nextTag = tags[index + 1];
    return [distance(tag, nextTag), tag, nextTag];
  })
    .filter(([dist]) => dist > 1)
    .map(createError);
};

const testTags = (allTags) => {
  const tagsPerLine = groupTagsPerLine(allTags);
  return flatMap(collectErrorsPerLine)(tagsPerLine);
};

module.exports = {
  run: ({feature}) => flatMapNodeTags(({tags = []}) => testTags(tags))(feature),
  name: rule,
  isValidConfig: () => [],
};
