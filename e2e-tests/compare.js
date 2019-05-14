const fs = require('fs');
const {promisify} = require('util');
const diff = require('diff');
const {red, green, bgRed, bgGreen} = require('chalk');
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

const collectDiffInfo = (info, lineDiff) => {
  const {chunks, removed, added} = info;
  if (lineDiff.removed) {
    info.removed = lineDiff.value;
  } else if (lineDiff.added) {
    info.added = lineDiff.value;
  } else {
    if (removed) {
      chunks.push({
        removed: justValue(removed),
      });
    } else if (added) {
      chunks.push({
        added: justValue(added),
      });
    }
    chunks.push({
      equal: justValue(lineDiff.value),
    });
    return {chunks};
  }
  if (info.removed && info.added) {
    const charDiff = diff.diffChars(info.removed, info.added);
    chunks.push({
      added: charDiff.filter(({removed}) => !removed),
      removed: charDiff.filter(({added}) => !added),
    });
    return {chunks};
  }
  return info;
};

const justValue = (value) => [{value}];

const formatCharDiff = (charDiff, color, strong, prefix) => {
  const last = charDiff.pop();
  last.value = last.value.replace(/(\r\n|\r|\n)$/g, '');
  charDiff.push(last);
  return color(prefix) + ' ' + charDiff.reduce((line, chunk) => {
    const value = chunk.value.split(/\r\n|\r|\n/g).join('\n' + prefix + ' ');
    if (chunk.removed || chunk.added) {
      return line + strong(value);
    }
    return line + color(value);
  }, '') + '\n';
};

const formatLineDiff = (chunk) => {
  let line = '';
  if (chunk.removed) {
    line += formatCharDiff(chunk.removed, red, bgRed.white, '-');
  }
  if (chunk.added) {
    line += formatCharDiff(chunk.added, green, bgGreen.white, '+');
  }
  if (chunk.equal) {
    line += formatCharDiff(chunk.equal, (x) => x, (x) => x, ' ');
  }
  return line;
};

const buildDiff = (actualContent, expectedContent) => () => {
  const differences = diff.diffLines(actualContent, expectedContent);
  // console.log(differences)
  const formattedDiff = differences.reduce(collectDiffInfo, {
    chunks: [],
  }).chunks.reduce((line, lineDiff) => line + formatLineDiff(lineDiff), '');

  return actualContent !== expectedContent
    ? formattedDiff
    : '';
};

const formatFiles = (actualFile, expectedFile) => {
  return red(`- ${actualFile}`) + '  ' + green(`+ ${expectedFile}`) + '\n\n';
};

const compare = (actualFile, expectedFile) => {
  return Promise.all([
    readFile(actualFile, 'utf8'),
    readFile(expectedFile, 'utf8'),
  ])
    .then(([actual, expected]) => {
      const actualContent = replaceDirname(actual);
      return writeFile(actualFile, actualContent, 'utf8')
        .then(buildDiff(actualContent, expected));
    })
    .then((diff) => diff ? {
      message: formatFiles(actualFile, expectedFile) + diff,
    } : null)
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
      process.stdout.write(error.message); // eslint-disable-line no-console
    });
    process.exit(errors.length > 0 ? 1 : 0);
  });
