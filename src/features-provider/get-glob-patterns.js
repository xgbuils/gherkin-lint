const path = require('path');

const getGlobPatterns = (pattern, suffix = '**') => {
  const cookedPattern = pattern.trim()
    .replace(/^\/?\*\*\/?/, '')
    .replace(/\/\*\*\/?$/, '/');
  if (['', '.', '/'].indexOf(cookedPattern) !== -1) {
    return [suffix];
  }
  const absolutePath = /^\//.test(cookedPattern);
  const posibleFile = !/\/$/.test(cookedPattern);
  let globPatterns = [path.join(cookedPattern, suffix)];
  if (posibleFile) {
    globPatterns.push(cookedPattern);
  }
  if (!absolutePath) {
    globPatterns = globPatterns.map((pattern) => path.join('**', pattern));
  } else {
    globPatterns = globPatterns.map((pattern) => pattern.substring(1));
  }
  return globPatterns;
};

module.exports = getGlobPatterns;
