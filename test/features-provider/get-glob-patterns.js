const expect = require('chai').expect;
const getGlobPatterns = require('../../src/features-provider/get-glob-patterns.js');
const suffix = '**/*.feature';

describe('getGlobPatterns', function() {
  it('.', function() {
    const result = getGlobPatterns('.', suffix);
    expect(result).to.be.deep.equal([suffix]);
  });
  it('**', function() {
    const result = getGlobPatterns('**', suffix);
    expect(result).to.be.deep.equal([suffix]);
  });
  it('/**', function() {
    const result = getGlobPatterns('/**', suffix);
    expect(result).to.be.deep.equal([suffix]);
  });
  it('**/', function() {
    const result = getGlobPatterns('**/', suffix);
    expect(result).to.be.deep.equal([suffix]);
  });
  it('/**/', function() {
    const result = getGlobPatterns('/**/', suffix);
    expect(result).to.be.deep.equal([suffix]);
  });
  it('foo', function() {
    const result = getGlobPatterns('foo', suffix);
    expect(result).to.be.deep.equal([`**/foo/${suffix}`, '**/foo']);
  });
  it('/foo', function() {
    const result = getGlobPatterns('/foo', suffix);
    expect(result).to.be.deep.equal([`foo/${suffix}`, 'foo']);
  });
  it('foo/', function() {
    const result = getGlobPatterns('foo/', suffix);
    expect(result).to.be.deep.equal([`**/foo/${suffix}`]);
  });
  it('/foo/', function() {
    const result = getGlobPatterns('/foo/', suffix);
    expect(result).to.be.deep.equal([`foo/${suffix}`]);
  });
  it('**/foo', function() {
    const result = getGlobPatterns('**/foo', suffix);
    expect(result).to.be.deep.equal([`**/foo/${suffix}`, '**/foo']);
  });
  it('foo/**', function() {
    const result = getGlobPatterns('foo/**', suffix);
    expect(result).to.be.deep.equal([`**/foo/${suffix}`]);
  });
  it('foo/**/', function() {
    const result = getGlobPatterns('foo/**/', suffix);
    expect(result).to.be.deep.equal([`**/foo/${suffix}`]);
  });
  it('**/foo/', function() {
    const result = getGlobPatterns('**/foo/', suffix);
    expect(result).to.be.deep.equal([`**/foo/${suffix}`]);
  });
  it('/foo/**', function() {
    const result = getGlobPatterns('/foo/**', suffix);
    expect(result).to.be.deep.equal([`foo/${suffix}`]);
  });
  it('/foo/**/', function() {
    const result = getGlobPatterns('/foo/**/', suffix);
    expect(result).to.be.deep.equal([`foo/${suffix}`]);
  });
  it('**/foo/**', function() {
    const result = getGlobPatterns('**/foo/**', suffix);
    expect(result).to.be.deep.equal([`**/foo/${suffix}`]);
  });
});
