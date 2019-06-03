#!/usr/bin/env node
const Gherkin = require('gherkin');
const factory = require('./factory');

module.exports = factory(Gherkin, {
  cwd: process.cwd(),
});
