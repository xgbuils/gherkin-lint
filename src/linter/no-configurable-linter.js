const getLocation = (lineContent) => {
  const [, line, column] = lineContent.match(/\((\d+):(\d+).*/) || [];
  return column === undefined ? {} : {
    line: parseInt(line),
    column: parseInt(column),
  };
};

class NoConfigurableLinter {
  constructor(parser) {
    this.parser = parser;
  }

  lint(file) {
    return this.parser.parse(file)
      .then(({feature, languageKeywords}) => [{
        feature,
        languageKeywords,
        file,
      }], (e) => {
        if (e.errors) {
          return Promise.reject(processFatalErrors(e.errors));
        }
        return Promise.reject(e);
      });
  }
}

function processFatalErrors(errors) {
  let errorMsgs = [];
  if (errors.length > 1) {
    const result = getFormatedTaggedBackgroundError(errors);
    errors = result.errors;
    errorMsgs = result.errorMsgs;
  }
  errors.forEach(function(error) {
    errorMsgs.push(getFormattedFatalError(error));
  });
  return errorMsgs;
}

function getFormatedTaggedBackgroundError(errors) {
  const errorMsgs = [];
  let index = 0;
  if (errors[0].message.indexOf('got \'Background') > -1 &&
      errors[1].message.indexOf('expected: #TagLine, #ScenarioLine, #ScenarioOutlineLine, #Comment, #Empty') > -1) {
    errorMsgs.push({
      message: 'Tags on Backgrounds are dissallowed',
      rule: 'no-tags-on-backgrounds',
      location: getLocation(errors[0].message),
    });

    index = 2;
    for (let i = 2; i < errors.length; i++) {
      if (errors[i].message.indexOf('expected: #TagLine, #ScenarioLine, #ScenarioOutlineLine, #Comment, #Empty') > -1) {
        index = i + 1;
      } else {
        break;
      }
    }
  }
  return {errors: errors.slice(index), errorMsgs: errorMsgs};
}

function getFormattedFatalError(error) {
  const location = getLocation(error.message);
  let errorMsg;
  let rule;
  if (error.message.indexOf('got \'Background') > -1) {
    errorMsg = 'Multiple "Background" definitions in the same file are disallowed';
    rule = 'up-to-one-background-per-file';
  } else if (error.message.indexOf('got \'Feature') > -1) {
    errorMsg = 'Multiple "Feature" definitions in the same file are disallowed';
    rule = 'one-feature-per-file';
  } else if (error.message.indexOf('expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ScenarioLine, #ScenarioOutlineLine, #Comment, #Empty, got \'Examples:\'') > -1) {
    errorMsg = 'Cannot use "Examples" in a "Scenario", use a "Scenario Outline" instead';
    rule = 'no-examples-in-scenarios';
  } else if (error.message.indexOf('expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ScenarioLine, #ScenarioOutlineLine, #Comment, #Empty, got') > -1 ||
             error.message.indexOf('expected: #EOF, #TableRow, #DocStringSeparator, #StepLine, #TagLine, #ExamplesLine, #ScenarioLine, #ScenarioOutlineLine, #Comment, #Empty, got') > -1) {
    errorMsg = 'Steps should begin with "Given", "When", "Then", "And" or "But". Multiline steps are dissallowed';
    rule = 'no-multiline-steps';
  } else {
    errorMsg = error.message;
    rule = 'unexpected-error';
  }
  return {
    message: errorMsg,
    rule: rule,
    location,
  };
}

module.exports = NoConfigurableLinter;
