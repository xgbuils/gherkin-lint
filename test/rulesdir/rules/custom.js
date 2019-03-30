const rule = 'custom';

function custom() {
  return [
    {
      type: 'rule',
      message: 'Custom error',
      rule: rule,
      line: 123,
    },
  ];
}

module.exports = {
  name: rule,
  run: custom,
  isValidConfig: () => true,
};
