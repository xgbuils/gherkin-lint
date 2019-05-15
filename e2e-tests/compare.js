const fs = require('fs');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);

const compare = (actualFile, expectedFile) => {
  return Promise.all([
    readFile(actualFile, 'utf8'),
    readFile(expectedFile, 'utf8'),
  ])
    .then(([actual, expected]) => {
      return actual !== expected ? {
        message: `actual:\n${actual}\n\nexpected:\n${expected}\n`,
      } : null;
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
