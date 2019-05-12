const runRules = (rules, params) => {
  let errors = [];

  for (let index = 0; index < rules.length; ++index) {
    const rule = rules[index];
    const ruleErrors = rule.execute(params);
    if (ruleErrors.length > 0 && rule.hasPriority()) {
      return ruleErrors;
    } else {
      errors = errors.concat(...ruleErrors);
    }
  }
  return errors;
};

class ConfigurableLinter {
  constructor(noConfigurableLinter) {
    this.noConfigurableLinter = noConfigurableLinter;
  }

  lint(file, rules) {
    const result = this.noConfigurableLinter.lint(file);
    if (result.isSuccess()) {
      const [params] = result.getSuccesses();
      return runRules(rules, params);
    } else {
      return result.getFailures();
    }
  }
}

module.exports = ConfigurableLinter;
