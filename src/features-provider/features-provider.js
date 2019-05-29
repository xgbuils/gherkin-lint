const {flatMap, flatten, uniq} = require('../utils/generic');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const getPath = require('../utils/get-path');
const defaults = require('../defaults');
const getGlobPatterns = require('./get-glob-patterns');

const defaultIgnoredFiles = 'node_modules/**'; // Ignore node_modules by default
const invalidFormatMessage = (pattern) =>
  `Invalid format of the feature file path/pattern: "${pattern}".\n`;
const USE_EXISTING_FEATURE =
  'To run the linter please specify an existing feature file, directory or glob.';
const LINE_SEPARATOR_REGEXP = /\r\n|\r|\n/;

const filterFeatures = (fileNames) => {
  return fileNames.filter((fileName) => /.feature$/.test(fileName));
};

const parseFileListBasedOn = (cwd) => (fileNames) => {
  return filterFeatures(uniq(fileNames))
    .map((fileName) => {
      const content = fs.readFileSync(path.resolve(cwd, fileName), 'utf-8');
      return {
        content,
        name: fileName,
        lines: content.split(LINE_SEPARATOR_REGEXP),
        path: path.resolve(cwd, fileName),
      };
    });
};

const getIgnorePatterns = (ignore, cwd) => {
  const ignorePatterns = [defaultIgnoredFiles];
  const ignorePath = getPath(cwd, ignore);
  if (fs.existsSync(ignorePath)) {
    ignorePatterns.push(...fs.readFileSync(ignorePath)
      .toString()
      .split(LINE_SEPARATOR_REGEXP)
      .filter((str) => str.trim() !== '')
    );
  }
  return flatMap(getGlobPatterns)(ignorePatterns);
};

const reportFailure = (pattern) => {
  return Promise.reject({
    type: 'feature-pattern-error',
    message: `${invalidFormatMessage(pattern)}${USE_EXISTING_FEATURE}`,
  });
};

const getFileNames = (globOptions) => (pattern) => {
  const globPatterns = getGlobPatterns(pattern, '**/*.feature');
  const fileNames = filterFeatures(flatMap((globPattern) => {
    return glob.sync(globPattern, globOptions);
  })(globPatterns));
  if (fileNames.length === 0) {
    return reportFailure(pattern);
  }
  return Promise.resolve(fileNames);
};

class FeatureProvider {
  constructor(args, {ignore = defaults.ignore, cwd}) {
    this.args = args;
    this.ignore = ignore;
    this.cwd = cwd;
  }

  provide() {
    const {args, ignore, cwd} = this;
    const parseFileList = parseFileListBasedOn(cwd);
    const patterns = args.length ? args : ['.'];
    const globOptions = {
      ignore: getIgnorePatterns(ignore, cwd),
      cwd,
    };
    return Promise.all(patterns.map(getFileNames(globOptions)))
      .then(flatten)
      .then(parseFileList);
  }
}

module.exports = FeatureProvider;
