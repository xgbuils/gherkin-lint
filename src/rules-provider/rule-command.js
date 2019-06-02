class RuleCommand {
  constructor({
    name,
    run,
    init = () => {},
    config = {},
    suppressOtherRules = false,
  }) {
    this.name = name;
    this.run = run;
    this.options = Object.assign({}, init());
    this.config = config;
    this.suppressOtherRules = suppressOtherRules;
  }

  execute(params) {
    return this.run(Object.assign({
      config: this.config,
    }, params));
  }

  hasPriority() {
    return this.suppressOtherRules;
  }
}

module.exports = RuleCommand;
