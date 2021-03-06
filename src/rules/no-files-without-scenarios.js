const rule = 'no-files-without-scenarios';
const {isScenario, getFeatureNodes} = require('../utils/selectors');

const noFilesWithoutScenarios = (feature) => {
  return getFeatureNodes(feature).some(isScenario) ? [] : [{
    type: 'rule',
    message: 'Feature file does not have any Scenarios',
    rule: rule,
    location: {
      line: 1,
      column: 1,
    },
  }];
};

module.exports = {
  name: rule,
  run: noFilesWithoutScenarios,
  isValidConfig: () => [],
};
