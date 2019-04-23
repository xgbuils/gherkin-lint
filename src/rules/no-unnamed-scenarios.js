const rule = 'no-unnamed-scenarios';
const {flatMapScenarios} = require('../utils/gherkin');

const createError = ({name, location}) => name ? [] : [{
  type: 'rule',
  message: 'Missing Scenario name',
  rule: rule,
  location: location,
}];

const noUnNamedScenarios = flatMapScenarios(createError);

module.exports = {
  name: rule,
  run: noUnNamedScenarios,
  isValidConfig: () => [],
};
