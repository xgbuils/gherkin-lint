const path = require('path');
const expect = require('chai').expect;
const linterFactory = require('../../../src/linter/factory');

const pathToDefaultRules = path.resolve(__dirname, '..', '..', '..', 'src', 'rules');
const pathToLocalRules = path.join(__dirname, 'rules'); // absolute path;
const pathToOtherRules = path.join('test', 'linter', 'factory', 'other_rules'); // relative path from root
const Gherkin = require('gherkin');

describe('Linter Factory', function() {
  it('linter that report rule failures', function() {
    const featureFile = 'failure.feature';
    const linter = linterFactory({
      config: path.join(__dirname, '.gherkin-lintrc'),
      format: 'stylish',
      rulesDirs: [
        pathToDefaultRules, pathToLocalRules, pathToOtherRules,
      ],
      args: [featureFile],
    }, Gherkin);
    return linter.lint().then((result) => {
      expect(result.logType).to.be.equal('log');
      expect(result.exit).to.be.equal(1);
      expect(result.errorLines[0]).to.include('failure.feature');
      expect(result.errorLines[1]).to.include('Wrong indentation for "Feature", expected indentation level of 0, but got 4');
      expect(result.errorLines[2]).to.include('Another custom-list error');
      expect(result.errorLines[3]).to.include('Custom error');
      expect(result.errorLines[4]).to.include('Another custom error');
      expect(result.errorLines[5]).to.include('\n');
      expect(result.errorLines.length).to.be.equal(6);
    }, () => {
      expect.fail('linter factory must not fail');
    });
  });

  it('linter that succeed', function() {
    const featureFile = 'success.feature';
    const linter = linterFactory({
      config: path.join(__dirname, '.indentation-lintrc'),
      format: 'stylish',
      rulesDirs: [pathToDefaultRules],
      args: [featureFile],
    }, Gherkin);
    return linter.lint().then((result) => {
      expect(result).to.be.deep.equal({
        logType: 'log',
        exit: 0,
        errorLines: [],
      });
    }, () => {
      expect.fail('linter factory must not fail');
    });
  });

  it('config file not found', function() {
    const featureFile = 'success.feature';
    const linter = linterFactory({
      config: path.join(__dirname, '.not-found-lintrc'),
      format: 'stylish',
      rulesDirs: [pathToDefaultRules],
      args: [featureFile],
    }, Gherkin);
    return linter.lint().then((result) => {
      expect(result.logType).to.be.equal('error');
      expect(result.exit).to.be.equal(1);
      expect(result.errorLines.length).to.be.equal(1);
      expect(result.errorLines[0]).to.include('Could not find specified config file');
      expect(result.errorLines[0]).to.include('.not-found-lintrc');
    }, () => {
      expect.fail('linter factory must not fail');
    });
  });

  it('default config file not found', function() {
    const featureFile = 'success.feature';
    const linter = linterFactory({
      format: 'stylish',
      rulesDirs: [pathToDefaultRules],
      args: [featureFile],
    }, Gherkin);
    return linter.lint().then((result) => {
      expect(result.logType).to.be.equal('error');
      expect(result.exit).to.be.equal(1);
      expect(result.errorLines.length).to.be.equal(1);
      expect(result.errorLines[0]).to.include('Could not find default config file ".gherkin-lintrc" in the working directory.');
      expect(result.errorLines[0]).to.include('To use a custom name/path provide the config file using the "-c" arg.');
    }, () => {
      expect.fail('linter factory must not fail');
    });
  });

  it('default format is stylish', function() {
    const featureFile = 'success.feature';
    const linter = linterFactory({
      rulesDirs: [pathToDefaultRules],
      args: [featureFile],
    }, Gherkin);
    return linter.lint().then((result) => {
      expect(result.logType).to.be.equal('error');
      expect(result.exit).to.be.equal(1);
      expect(result.errorLines.length).to.be.equal(1);
      expect(result.errorLines[0]).to.include('Could not find default config file ".gherkin-lintrc" in the working directory.');
      expect(result.errorLines[0]).to.include('To use a custom name/path provide the config file using the "-c" arg.');
    }, () => {
      expect.fail('linter factory must not fail');
    });
  });
});
