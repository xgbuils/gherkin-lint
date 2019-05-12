const rule = 'no-unnamed-features';

const noUnNamedFeatures = ({feature: {name, location}}) => {
  return !name && location ? [{
    type: 'rule',
    message: 'Missing Feature name',
    rule: rule,
    location: location,
  }] : [];
};

module.exports = {
  name: rule,
  run: noUnNamedFeatures,
  isValidConfig: () => [],
};
