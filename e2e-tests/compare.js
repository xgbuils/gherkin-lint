const fs = require('fs');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const replaceDirname = (content) => {
  const lastIndex = __dirname.lastIndexOf('pickle-lint');
  const needle = __dirname.slice(0, lastIndex);
  const patternFound = content.indexOf(needle) >= 0;
  if (patternFound) {
    return content.replace(new RegExp(needle, 'g'), '/path/to/');
  }
  return '';
};

const compare = (actualFile, expectedFile) => {
  return Promise.all([
    readFile(actualFile, 'utf8'),
    readFile(expectedFile, 'utf8'),
  ])
    .then(([actual, expected]) => {
      const actualContent = replaceDirname(actual);
      return writeFile(actualFile, actualContent, 'utf8')
        .then(() => actualContent !== expected ? {
          message: `actual:\n${actualContent}\n\nexpected:\n${expected}\n`,
        } : null);
    })
    .catch((err) => ({
      message: err,
    }));
};

Promise.all([
  compare('stdout.txt', 'expected-stdout.txt'),
  compare('stderr.txt', 'expected-stderr.txt'),
])
  .then((results) => {
    const errors = results.filter((result) => result);
    errors.forEach((error) => {
      console.log(error.message); // eslint-disable-line no-console
    });
    process.exit(errors.length > 0 ? 1 : 0);
  });
