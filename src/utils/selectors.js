const isScenario = ({type}) => ['Scenario', 'ScenarioOutline'].indexOf(type) !== -1;
const getFeatureNodes = ({children}) => children || [];

module.exports = {
  isScenario,
  getType: ({type}) => type,
  getFeatureNodes,
  getScenarios: (feature) => getFeatureNodes(feature).filter(isScenario),
  getSteps: ({steps}) => steps,
  getExamples: ({examples = []}) => examples,
  getTableBody: ({tableBody}) => tableBody,
  getTableHeader: ({tableHeader}) => tableHeader,
};
