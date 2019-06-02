const rule = 'another-custom-list';
const objectRuleValidation = require('../../../../src/config/object-rule-validation');
const availableConfigs = {
  'element': [],
};

function custom() {
  return [
    {
      type: 'rule',
      message: 'Another custom-list error',
      rule: rule,
      location: {
        line: 109,
        column: 4,
      },
    },
  ];
}

module.exports = {
  name: rule,
  run: custom,
  isValidConfig: objectRuleValidation(availableConfigs),
};
