const assert = require('chai').assert;
const FeaturesProvider = require('../../src/features-provider/features-provider.js');
const path = require('path');
const cwd = path.resolve(process.cwd(), './test/features-provider/');
const createFeatureProvider = (args, options) => {
  return new FeaturesProvider(args, Object.assign({cwd}, options));
};
const expectedPath = (fileRelativePath) => {
  return path.resolve(cwd, fileRelativePath);
};
const noIgnore = {
  ignore: '.no-lintignore',
};
const customIgnore = {
  ignore: '.custom-lint-ignore',
};

const noFilesFailure = (pattern) => ({
  type: 'feature-pattern-error',
  message: `Invalid format of the feature file path/pattern: "${pattern}".\n` +
  'To run the linter please specify an existing feature file, directory or glob.',
});

const expectedFiles = {
  'other.feature': {
    content: 'Feature: other',
    lines: [
      'Feature: other',
    ],
    name: 'other.feature',
    path: expectedPath('other.feature'),
  },
  'fixtures': {
    'a.feature': {
      content: 'Feature:',
      lines: [
        'Feature:',
      ],
      name: 'fixtures/a.feature',
      path: expectedPath('fixtures/a.feature'),
    },
    'foo': {
      'foo.feature': {
        content: 'Feature: foo\nScenario:',
        lines: [
          'Feature: foo',
          'Scenario:',
        ],
        name: 'fixtures/foo/foo.feature',
        path: expectedPath('fixtures/foo/foo.feature'),
      },
      'bar.feature': {
        content: 'Feature: bar\nScenario:\n',
        lines: [
          'Feature: bar',
          'Scenario:',
          '',
        ],
        name: 'fixtures/foo/bar.feature',
        path: expectedPath('fixtures/foo/bar.feature'),
      },
    },
  },
};

describe('Feature Provider', () => {
  context('no ignoring files', () => {
    it('dot pattern returns all features', () => {
      const featureFinder = createFeatureProvider(['.'], noIgnore);
      return featureFinder.provide().then((result) => {
        assert.deepEqual(result, [
          expectedFiles['fixtures']['a.feature'],
          expectedFiles['fixtures']['foo']['bar.feature'],
          expectedFiles['fixtures']['foo']['foo.feature'],
          expectedFiles['other.feature'],
        ]);
      }, () => {
        assert.fail('features provider must not fail');
      });
    });

    it('does not return duplicates', () => {
      const featureFinder = createFeatureProvider([
        'fixtures',
        'fixtures/foo',
      ], noIgnore);
      return featureFinder.provide().then((result) => {
        assert.deepEqual(result, [
          expectedFiles['fixtures']['a.feature'],
          expectedFiles['fixtures']['foo']['bar.feature'],
          expectedFiles['fixtures']['foo']['foo.feature'],
        ]);
      }, () => {
        assert.fail('features provider must not fail');
      });
    });

    it('two asterisks', () => {
      const featureFinder = createFeatureProvider([
        'fixtures/**',
      ], noIgnore);
      return featureFinder.provide().then((result) => {
        assert.deepEqual(result, [
          expectedFiles['fixtures']['a.feature'],
          expectedFiles['fixtures']['foo']['bar.feature'],
          expectedFiles['fixtures']['foo']['foo.feature'],
        ]);
      }, () => {
        assert.fail('features provider must not fail');
      });
    });

    it('only directory children files', () => {
      const featureFinder = createFeatureProvider([
        'fixtures/*.*',
      ], noIgnore);
      return featureFinder.provide().then((result) => {
        assert.deepEqual(result, [
          expectedFiles['fixtures']['a.feature'],
        ]);
      }, () => {
        assert.fail('features provider must not fail');
      });
    });

    it('complex pattern', () => {
      const featureFinder = createFeatureProvider([
        'fixtures/f*/b*.feature',
      ], noIgnore);
      return featureFinder.provide().then((result) => {
        assert.deepEqual(result, [
          expectedFiles['fixtures']['foo']['bar.feature'],
        ]);
      }, () => {
        assert.fail('features provider must not fail');
      });
    });

    it('returns a failure when pattern does not find files', () => {
      const featureFinder = createFeatureProvider([
        '/foo',
      ], noIgnore);
      return featureFinder.provide().then(() => {
        assert.fail('features provider must fail');
      }, (result) => {
        assert.deepEqual(result, noFilesFailure('/foo'));
      });
    });
  });

  context('ignoring with custom file', () => {
    it('dot pattern returns all features except ignored files', () => {
      const featureFinder = createFeatureProvider(['.'], customIgnore);
      return featureFinder.provide().then((result) => {
        assert.deepEqual(result, [
          expectedFiles['fixtures']['a.feature'],
          expectedFiles['other.feature'],
        ]);
      }, () => {
        assert.fail('features provider must not fail');
      });
    });

    it('returns a failure if some pattern does not bring files', () => {
      const featureFinder = createFeatureProvider([
        'fixtures',
        'fixtures/foo',
      ], customIgnore);
      return featureFinder.provide().then(() => {
        assert.fail('features provider must fail');
      }, (result) => {
        assert.deepEqual(result, noFilesFailure('fixtures/foo'));
      });
    });

    it('complex pattern', () => {
      const featureFinder = createFeatureProvider([
        'f*s',
      ], customIgnore);
      return featureFinder.provide().then((result) => {
        assert.deepEqual(result, [
          expectedFiles['fixtures']['a.feature'],
        ]);
      }, () => {
        assert.fail('features provider must not fail');
      });
    });

    it('returns a failure when pattern does not find files', () => {
      const featureFinder = createFeatureProvider([
        'fixtures/f*/b*.feature',
      ], customIgnore);
      return featureFinder.provide().then(() => {
        assert.fail('features provider must fail');
      }, (result) => {
        assert.deepEqual(result, noFilesFailure('fixtures/f*/b*.feature'));
      });
    });
  });

  context('ignoring with default file', () => {
    it('no pattern returns all features except ignored files', () => {
      const featureFinder = createFeatureProvider([]);
      return featureFinder.provide().then((result) => {
        assert.deepEqual(result, [
          expectedFiles['other.feature'],
        ]);
      }, () => {
        assert.fail('features provider must not fail');
      });
    });

    it('returns a failure when pattern does not find files', () => {
      const featureFinder = createFeatureProvider([
        'fixtures/f*/b*.feature',
      ]);
      return featureFinder.provide().then(() => {
        assert.fail('features provider must fail');
      }, (result) => {
        assert.deepEqual(result, noFilesFailure('fixtures/f*/b*.feature'));
      });
    });
  });

  context('finding features in empty feature directory', () => {
    it('returns a failure', () => {
      const featureFinder = createFeatureProvider([
        'no_features',
      ]);
      return featureFinder.provide().then(() => {
        assert.fail('features provider must fail');
      }, (result) => {
        assert.deepEqual(result, noFilesFailure('no_features'));
      });
    });
  });
});
