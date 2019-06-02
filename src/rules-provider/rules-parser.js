const enablingSettings = ['on', 'off'];
const {flatten} = require('../utils/generic');
const RuleCommand = require('./rule-command');

function isValidEnablingSetting(enablingSetting) {
  return enablingSettings.indexOf(enablingSetting) !== -1;
}

function normalizeRule(rules, config, ruleName) {
  const rule = rules[ruleName];
  const ruleConfig = config[ruleName];
  if (!rule) {
    return Promise.reject([{
      type: 'undefined-rule',
      message: `Rule "${ ruleName }" does not exist`,
    }]);
  } else if (Array.isArray(ruleConfig)) {
    if (!isValidEnablingSetting(ruleConfig[0])) {
      return Promise.reject([{
        type: 'config-rule-error',
        message: 'The first part of config should be "on" or "off"',
      }]);
    }

    if (ruleConfig.length != 2 ) {
      return Promise.reject([{
        type: 'config-rule-error',
        message: 'The config should only have 2 parts.',
      }]);
    }
    const errorList = rule.isValidConfig(config);
    errorList.forEach((error) => error.type = 'config-rule-error');
    if (errorList.length > 0) {
      return Promise.reject(errorList);
    } else if (ruleConfig[0] === 'off') {
      return Promise.resolve([]);
    }
    return Promise.resolve([new RuleCommand({
      name: rule.name,
      run: rule.run,
      init: rule.init,
      config: ruleConfig[1],
      suppressOtherRules: rule.suppressOtherRules,
    })]);
  } else {
    if (!isValidEnablingSetting(ruleConfig)) {
      return Promise.reject([{
        type: 'config-rule-error',
        message: 'config should be "on" or "off"',
      }]);
    } else if (ruleConfig === 'off') {
      return Promise.resolve([]);
    }
    return Promise.resolve([new RuleCommand({
      name: rule.name,
      run: rule.run,
      init: rule.init,
      suppressOtherRules: rule.suppressOtherRules,
    })]);
  }
}

const getRuleResultPromises = (rules, config) => {
  return Object.keys(config).map((ruleName) => {
    return normalizeRule(rules, config, ruleName);
  });
};

const getErrors = (prom) => {
  return prom.then(
    (result) => [],
    (errors) => (errors)
  );
};

const filterRules = (rulePromises) => {
  return Promise.all(rulePromises).then(
    flatten,
    () => []
  );
};

const filterErrors = (rulePromises) => {
  return Promise.all(rulePromises.map(getErrors))
    .then(flatten)
    .then((errors) => {
      return errors.length > 0 ? Promise.reject(errors) : [];
    });
};

const buildConfigErrors = (errors) => ({
  type: 'config-error',
  message: 'Error(s) in configuration file:',
  errors,
});

class RuleParser {
  constructor(rules) {
    this.rules = rules;
  }

  parse(config) {
    const {rules} = this;
    const promises = getRuleResultPromises(rules, config);
    const rulesPromise = filterRules(promises);
    const errorsPromise = filterErrors(promises);
    return Promise.all([rulesPromise, errorsPromise])
      .then(
        ([rules]) => rules,
        (errors) => Promise.reject(buildConfigErrors(errors))
      );
  }
}

module.exports = RuleParser;
