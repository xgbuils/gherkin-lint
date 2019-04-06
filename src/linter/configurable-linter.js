const runRules = (rules, {file, feature = {}}) => {
  let errors = [];

  for (let index = 0; index < rules.length; ++index) {
    const rule = rules[index];
    const ruleErrors = rule.execute({file, feature});
    if (rule.hasPriority()) {
      return ruleErrors;
    } else {
      errors = errors.concat(...ruleErrors);
    }
  }
  return errors;
};

class ConfigurableLinter {
  constructor(noConfigurableLinter, rules) {
    this.noConfigurableLinter = noConfigurableLinter;
    this.rules = rules;
  }

  lint(file) {
    const result = this.noConfigurableLinter.lint(file);
    if (result.isSuccess()) {
      const [config] = result.getSuccesses();
      return runRules(this.rules, config);
    } else {
      return result.getFailures();
    }
  }
}

module.exports = ConfigurableLinter;