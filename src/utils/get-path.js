const path = require('path');

module.exports = (cwd, filePath) => {
  return path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
};
