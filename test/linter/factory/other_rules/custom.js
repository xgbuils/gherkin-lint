const rule = 'another-custom';

function custom() {
  return [
    {
      type: 'rule',
      message: 'Another custom error',
      rule: rule,
      location: {
        line: 456,
        column: 23,
      },
    },
  ];
}

module.exports = {
  name: rule,
  run: custom,
  isValidConfig: () => [],
};
