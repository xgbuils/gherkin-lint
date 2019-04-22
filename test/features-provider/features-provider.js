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
    content: 'other content',
    lines: [
      'other content',
    ],
    name: 'other.feature',
    path: expectedPath('other.feature'),
  },
  'fixtures': {
    'a.feature': {
      content: 'content',
      lines: [
        'content',
      ],
      name: 'fixtures/a.feature',
      path: expectedPath('fixtures/a.feature'),
    },
    'foo': {
      'foo.feature': {
        content: 'two\nlines',
        lines: [
          'two',
          'lines',
        ],
        name: 'fixtures/foo/foo.feature',
        path: expectedPath('fixtures/foo/foo.feature'),
      },
      'bar.feature': {
        content: 'three\nlines\n',
        lines: [
          'three',
          'lines',
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
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), true);
      assert.deepEqual(result.getSuccesses(), [
        expectedFiles['fixtures']['a.feature'],
        expectedFiles['fixtures']['foo']['bar.feature'],
        expectedFiles['fixtures']['foo']['foo.feature'],
        expectedFiles['other.feature'],
      ]);
    });

    it('does not return duplicates', () => {
      const featureFinder = createFeatureProvider([
        'fixtures',
        'fixtures/foo',
      ], noIgnore);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), true);
      assert.deepEqual(result.getSuccesses(), [
        expectedFiles['fixtures']['a.feature'],
        expectedFiles['fixtures']['foo']['bar.feature'],
        expectedFiles['fixtures']['foo']['foo.feature'],
      ]);
    });

    it('two asterisks', () => {
      const featureFinder = createFeatureProvider([
        'fixtures/**',
      ], noIgnore);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), true);
      assert.deepEqual(result.getSuccesses(), [
        expectedFiles['fixtures']['a.feature'],
        expectedFiles['fixtures']['foo']['bar.feature'],
        expectedFiles['fixtures']['foo']['foo.feature'],
      ]);
    });

    it('only directory children files', () => {
      const featureFinder = createFeatureProvider([
        'fixtures/*.*',
      ], noIgnore);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), true);
      assert.deepEqual(result.getSuccesses(), [
        expectedFiles['fixtures']['a.feature'],
      ]);
    });

    it('complex pattern', () => {
      const featureFinder = createFeatureProvider([
        'fixtures/f*/b*.feature',
      ], noIgnore);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), true);
      assert.deepEqual(result.getSuccesses(), [
        expectedFiles['fixtures']['foo']['bar.feature'],
      ]);
    });

    it('returns a failure when pattern does not find files', () => {
      const featureFinder = createFeatureProvider([
        '/foo',
      ], noIgnore);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), false);
      assert.deepEqual(result.getFailures(), [noFilesFailure('/foo')]);
    });
  });

  context('ignoring with custom file', () => {
    it('dot pattern returns all features except ignored files', () => {
      const featureFinder = createFeatureProvider(['.'], customIgnore);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), true);
      assert.deepEqual(result.getSuccesses(), [
        expectedFiles['fixtures']['a.feature'],
        expectedFiles['other.feature'],
      ]);
    });

    it('returns a failure if some pattern does not bring files', () => {
      const featureFinder = createFeatureProvider([
        'fixtures',
        'fixtures/foo',
      ], customIgnore);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), false);
      assert.deepEqual(result.getFailures(), [noFilesFailure('fixtures/foo')]);
    });

    it('complex pattern', () => {
      const featureFinder = createFeatureProvider([
        'f*s',
      ], customIgnore);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), true);
      assert.deepEqual(result.getSuccesses(), [
        expectedFiles['fixtures']['a.feature'],
      ]);
    });

    it('returns a failure when pattern does not find files', () => {
      const featureFinder = createFeatureProvider([
        'fixtures/f*/b*.feature',
      ], customIgnore);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), false);
      assert.deepEqual(result.getFailures(), [noFilesFailure('fixtures/f*/b*.feature')]);
    });
  });

  context('ignoring with default file', () => {
    it('no pattern returns all features except ignored files', () => {
      const featureFinder = createFeatureProvider([]);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), true);
      assert.deepEqual(result.getSuccesses(), [
        expectedFiles['other.feature'],
      ]);
    });

    it('returns a failure when pattern does not find files', () => {
      const featureFinder = createFeatureProvider([
        'fixtures/f*/b*.feature',
      ]);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), false);
      assert.deepEqual(result.getFailures(), [noFilesFailure('fixtures/f*/b*.feature')]);
    });
  });

  context('finding features in empty feature directory', () => {
    it('returns a failure', () => {
      const featureFinder = createFeatureProvider([
        'no_features',
      ]);
      const result = featureFinder.provide();
      assert.equal(result.isSuccess(), false);
      assert.deepEqual(result.getFailures(), [noFilesFailure('no_features')]);
    });
  });
});
