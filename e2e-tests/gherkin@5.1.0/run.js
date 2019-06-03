#!/usr/bin/env node

const {exec} = require('child_process');
const compare = require('../compare');
const cwd = __dirname;

exec('node index.js > stdout.txt 2> stderr.txt', {cwd}, (err, stdout) => {
  compare(cwd);
});

