const enablingSettings = ['on', 'off'];
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

function RuleParser(rules) {
  this.rules = rules;
}

const append = (result, array) => {
  result.push(...array);
  return result;
};

RuleParser.prototype.parse = function(config) {
  const {rules} = this;
  const resultPromise = Object.keys(config).reduce(function(resultPromise, ruleName) {
    const rulePromise = normalizeRule(rules, config, ruleName);
    return resultPromise.then(
      (result) => rulePromise.then(
        (rules) => append(result, rules),
        (errors) => Promise.reject(errors)
      ),
      (errorResults) => rulePromise.then(
        (rules) => Promise.reject(errorResults),
        (errorRules) => Promise.reject(append(errorResults, errorRules))
      )
    );
  }, Promise.resolve([]));
  return resultPromise.catch((errors) => Promise.reject({
    type: 'config-error',
    message: 'Error(s) in configuration file:',
    errors,
  }));
};

module.exports = RuleParser;
