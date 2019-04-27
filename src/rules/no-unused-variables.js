const rule = 'no-unused-variables';
const {
  compose,
  reduce,
} = require('../utils/generic');
const {filter, map} = require('../utils/transducers');
const {getFeatureNodes} = require('../utils/selectors');
const stepVariableRegex = /<([^>]*)>/gu;

const calculateLocation = (lines) => (node, match) => {
  const {line} = node.location;
  return {
    line,
    column: lines[line - 1].indexOf(match.input) + match.index + 2,
  };
};

const calculateDocStringLocation = (lines) => ({argument}, match) => {
  const splittedContent = match.input.substring(0, match.index).split(/\r\n|\r|\n/);
  const line = argument.location.line + splittedContent.length;
  const matchLine = lines[line - 1];
  const matchLinePrefix = splittedContent.slice(-1)[0];
  const columnStartPos = matchLine.indexOf(matchLinePrefix) + matchLinePrefix.length;
  return {
    line,
    column: matchLine.indexOf(match[0], columnStartPos) + 1,
  };
};

const collectVariables = (selector, getLocation) => (variables, node) => {
  let match;
  while ((match = stepVariableRegex.exec(selector(node))) != null) {
    variables.push({
      name: match[1],
      location: getLocation(node, match),
    });
  }
  return variables;
};

const collectTableVariables = (collectCellVariables) => (variables, step) => {
  return step.argument.rows.reduce((variables, row) => {
    return row.cells.reduce(collectCellVariables, variables);
  }, variables);
};

const collectArgumentVariables = (argCollectFunctions) => (variables, step) => {
  const {argument = {}} = step;
  const collectFunction = argCollectFunctions[argument.type];
  return collectFunction ? collectFunction(variables, step) : variables;
};

const collectScenarioVariables = (getLocation, getDocStringLocation, scenario) => {
  const collectNameVariables = collectVariables(({name}) => name, getLocation);
  const collectCellVariables = collectVariables(({value}) => value, getLocation);
  const collectDocStringVariables = collectVariables(
    ({argument}) => argument.content,
    getDocStringLocation
  );
  const collectStepArgumentVariables = collectArgumentVariables({
    DataTable: collectTableVariables(collectCellVariables),
    DocString: collectDocStringVariables,
  });
  const collectStepVariables = collectVariables(({text}) => text, getLocation);
  const variables = collectNameVariables([], scenario);

  return scenario.steps.reduce(function(variables, step) {
    variables = collectStepArgumentVariables(variables, step);
    return collectStepVariables(variables, step);
  }, variables);
};

const appendExampleVariable = (variables, cell) => {
  variables.push({
    name: cell.value,
    location: cell.location,
  });
  return variables;
};

const collectTableExampleVariables = (variables, cells) => reduce(
  filter(({value}) => value)(appendExampleVariable),
  variables
)(cells);


const collectExampleVariables = (examples) => reduce(compose(
  filter(({tableHeader}) => tableHeader),
  map(({tableHeader}) => tableHeader.cells)
)(collectTableExampleVariables), [])(examples);

const getVariableNames = (variables) => variables.reduce((names, variable) => {
  return names.add(variable.name);
}, new Set());

function noUnusedVariables(feature, {lines}) {
  const children = getFeatureNodes(feature);
  const errors = [];

  children.forEach(function(child) {
    if (child.type != 'ScenarioOutline') {
      // Variables are a feature of Scenario Outlines only
      return;
    }

    const examplesVariables = collectExampleVariables(child.examples);
    const scenarioVariables = collectScenarioVariables(
      calculateLocation(lines),
      calculateDocStringLocation(lines),
      child
    );
    const examplesVariablesNames = getVariableNames(examplesVariables);
    const scenarioVariablesNames = getVariableNames(scenarioVariables);

    for (const {name, location} of examplesVariables) {
      if (!scenarioVariablesNames.has(name)) {
        errors.push({
          type: 'rule',
          message: `Examples table variable "${name}" is not used in any step`,
          rule: rule,
          location,
        });
      }
    }

    for (const {name, location} of scenarioVariables) {
      if (!examplesVariablesNames.has(name)) {
        errors.push({
          type: 'rule',
          message: `Step variable "${name}" does not exist the in examples table`,
          rule: rule,
          location,
        });
      }
    }
  });

  return errors;
}

module.exports = {
  name: rule,
  run: noUnusedVariables,
  isValidConfig: () => [],
};
