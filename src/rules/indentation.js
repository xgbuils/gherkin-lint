const rule = 'indentation';
const objectRuleValidation = require('../config-validation/object-rule-validation');
const {
  getExamples,
  getTableBody,
  getTableHeader,
} = require('../utils/selectors');

const {
  applyToFeatureNode,
  flatMapFeatureNodes,
  flatMapSteps,
} = require('../utils/gherkin');

const {
  applyAfter,
  applyOver,
  compose,
  flatMap,
} = require('../utils/generic');

const groupTagsPerLine = require('../utils/group-tags-per-line');

const defaultConfig = {
  'Feature': 0,
  'Background': 0,
  'Scenario': 0,
  'Step': 2,
  'Examples': 0,
  'example': 2,
  'DocString': 4,
};

const availableConfigs = Object.assign({}, defaultConfig, {
  // The values here are unused by the config parsing logic.
  'feature tag': -1,
  'scenario tag': -1,
  'DocString line': -1,
});

const parseDocString = (lines) => (docString) => {
  const {line} = docString.location;
  const docStringLines = docString.content.split(/\r\n|\r|\n/);
  const rawDocStringLines = lines.slice(line, line + docStringLines.length);
  return Object.assign({}, docString, {
    lines: rawDocStringLines.map((rawLine, index) => {
      const column = rawLine.indexOf(docStringLines[index]) + 1;
      return {
        content: docStringLines[index],
        location: {
          line: line + index + 1,
          column,
        },
      };
    }),
  });
};

const mergeConfiguration = (config) => {
  const mergedConfiguration = Object.assign({}, defaultConfig, config);
  return Object.assign({
    'feature tag': mergedConfiguration['Feature'],
    'scenario tag': mergedConfiguration['Scenario'],
    'DocString line': mergedConfiguration['DocString'],
  }, mergedConfiguration);
};

const checkNodeIndentation = (mergedConfiguration) => (type) => (node) => {
  if (!node) {
    return [];
  }
  const {location} = node;
  const expectedIndentation = mergedConfiguration[type];
  const indentation = location.column - 1;

  return indentation !== expectedIndentation ? [{
    type: 'rule',
    message: `Wrong indentation for "${type}", expected indentation level of ` +
      `${expectedIndentation}, but got ${indentation}`,
    rule: rule,
    location,
  }] : [];
};

const checkTags = (testNode) => (node) => {
  const tagsPerLine = groupTagsPerLine(node.tags);
  const getFirstTag = ([tag]) => tag;
  return flatMap(compose(testNode, getFirstTag))(tagsPerLine);
};

const testDocString = (parseDocString, test) => (step) => {
  if (!step.argument || step.argument.type !== 'DocString') {
    return [];
  }
  const docString = parseDocString(step.argument);
  const docStringErrors = test('DocString')(docString);
  if (docStringErrors.length > 0) {
    return docStringErrors;
  }
  return docString.lines.map(test('DocString line'));
};

const testStep = (testDocstring, testNode) => (step) => {
  const stepType = step.type;
  return applyOver([
    testNode(stepType),
    testDocstring,
  ])(step);
};

const testFeature = (testStep, test) => {
  const testScenario = applyOver([
    test('Scenario'),
    checkTags(test('scenario tag')),
  ]);
  const testTableHeader = compose(test('example'), getTableHeader);
  const testTableBody = compose(flatMap(test('example')), getTableBody);
  const testExamplesPerTable = applyOver([
    test('Examples'),
    testTableHeader,
    testTableBody,
  ]);
  const testExamples = compose(flatMap(testExamplesPerTable), getExamples);
  const testScenarioOutline = applyOver([
    test('Scenario'),
    testExamples,
    checkTags(test('scenario tag')),
  ]);

  const checkStepsAfter = applyAfter(flatMapSteps(testStep));

  const checkIndentationOnFeatureNode = applyToFeatureNode({
    Background: checkStepsAfter(test('Background')),
    Scenario: checkStepsAfter(testScenario),
    ScenarioOutline: checkStepsAfter(testScenarioOutline),
  });

  return applyOver([
    test('Feature'),
    checkTags(test('feature tag')),
    flatMapFeatureNodes(checkIndentationOnFeatureNode),
  ]);
};

const run = ({feature, languageKeywords, file, config}) => {
  const {lines} = file;
  if (Object.keys(feature).length === 0) {
    return [];
  }
  const test = checkNodeIndentation(mergeConfiguration(config));

  return testFeature(
    testStep(
      testDocString(parseDocString(lines), test),
      test
    ),
    test
  )(feature);
};

module.exports = {
  name: rule,
  run,
  isValidConfig: objectRuleValidation(availableConfigs),
};
