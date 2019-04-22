const fs = require('fs');
const path = require('path');
const getPath = require('./utils/get-path');

class RulesProvider {
  constructor({rulesDirs, cwd}) {
    this.cwd = cwd;
    this.rulesDirs = rulesDirs;
  }

  provide() {
    const rules = {};
    this.rulesDirs.forEach((rulesDir) => {
      rulesDir = getPath(this.cwd, rulesDir);
      fs.readdirSync(rulesDir).forEach(function(file) {
        const rule = require(path.join(rulesDir, file));
        rules[rule.name] = rule;
      });
    });
    return rules;
  }
}

module.exports = RulesProvider;
