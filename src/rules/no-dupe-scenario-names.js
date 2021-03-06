const rule = 'no-dupe-scenario-names';
const {getFeatureNodes} = require('../utils/selectors');

const locationTrace = (file) => (scenario) => `${file.name}:${scenario.location.line}`;

const appendError = (dupeLocationTrace) => ({scenarios, errors}, scenario) => {
  const dupes = scenarios[scenario.name];
  errors.push({
    type: 'rule',
    message: `Scenario name is already used in: ${dupes}`,
    rule: rule,
    location: scenario.location,
  });
  scenarios[scenario.name] += `, ${dupeLocationTrace(scenario)}`;
  return {scenarios, errors};
};

const collectErrors = (appendError, dupeLocationTrace) => (track, scenario) => {
  const {scenarios, errors} = track;
  if (!scenario.name) {
    return track;
  } else if (scenarios[scenario.name]) {
    return appendError(track, scenario);
  }
  scenarios[scenario.name] = dupeLocationTrace(scenario);
  return {scenarios, errors};
};

const noDuplicateScenarioNames = function(feature, file) {
  const {scenarios} = this.options;
  const dupeLocationTrace = locationTrace(file);
  const collectScenarioErrors = collectErrors(
    appendError(dupeLocationTrace),
    dupeLocationTrace
  );

  return getFeatureNodes(feature).reduce(collectScenarioErrors, {
    scenarios,
    errors: [],
  }).errors;
};

module.exports = {
  init: () => ({
    scenarios: {},
  }),
  name: rule,
  run: noDuplicateScenarioNames,
  isValidConfig: () => [],
};
