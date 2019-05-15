const rule = 'custom';

function custom() {
  return [
    {
      type: 'rule',
      message: 'Custom error',
      rule: rule,
      location: {
        line: 123,
        column: 5,
      },
    },
  ];
}

module.exports = {
  name: rule,
  run: custom,
  isValidConfig: () => true,
};
