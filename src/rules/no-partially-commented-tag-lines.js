const rule = 'no-partially-commented-tag-lines';
const {flatMap} = require('../utils/generic');
const {flatMapNodeTags} = require('../utils/gherkin');

const createError = (tag) => {
  const commentPosition = tag.name.indexOf('#');
  return commentPosition < 0 ? [] : [{
    type: 'rule',
    message: 'Partially commented tag lines not allowed ',
    rule: rule,
    location: {
      line: tag.location.line,
      column: tag.location.column + commentPosition,
    },
  }];
};

module.exports = {
  name: rule,
  run: flatMapNodeTags(({tags}) => flatMap(createError)(tags)),
  isValidConfig: () => [],
};
