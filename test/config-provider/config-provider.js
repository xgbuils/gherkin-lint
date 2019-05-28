const expect = require('chai').expect;
const ConfigProvider = require('../../src/config-provider.js');
const cwd = __dirname;

describe('Config Provider', () => {
  describe('early exits with a non 0 exit code when', () => {
    it('the specified config file doesn\'t exist', () => {
      const configFilePath = './non/existing/path';
      const configProvider = new ConfigProvider({file: configFilePath, cwd});

      return configProvider.provide().then(() => {
        expect.fail('config provider must fail');
      }, (result) => {
        expect(result).to.be.deep.equal({
          type: 'config-error',
          message: `Could not find specified config file "${configFilePath}"`,
        });
      });
    });

    it('the specified config file exists', () => {
      const configProvider = new ConfigProvider({file: 'config.gherkinrc', cwd});

      return configProvider.provide().then((result) => {
        expect(result).to.be.deep.equal({
          'fake-rule': 'on',
        });
      }, () => {
        expect.fail('config provider must not fail');
      });
    });

    it('the specified config file exists but it is a badly formed JSON', () => {
      const configProvider = new ConfigProvider({file: 'wrong-config.json', cwd});

      return configProvider.provide().then(() => {
        expect.fail('config provider must fail');
      }, (result) => {
        expect(result).to.be.deep.equal({
          message: 'SyntaxError: Unexpected string in JSON at position 19',
          type: 'config-error',
        });
      });
    });

    it('no config file has been specified and default config file doesn\'t exist', () => {
      const configProvider = new ConfigProvider({cwd});

      return configProvider.provide().then(() => {
        expect.fail('config provider must fail');
      }, (result) => {
        expect(result).to.be.deep.equal({
          type: 'config-error',
          message: 'Could not find default config file ".gherkin-lintrc" in the working directory.\nTo use a custom name/path provide the config file using the "-c" arg.',
        });
      });
    });
  });
});
