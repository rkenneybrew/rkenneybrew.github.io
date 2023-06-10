var getAbi = require('node-abi').getAbi;
var pkg = require('../package.json');

module.exports = function binaryFilename(version, options) {
  options = options || {};
  var platform = options.platform || process.platform;
  var arch = options.arch || process.arch;
  var target = options.target || 'node';
  return [pkg.name, target, 'v' + getAbi(version, target), platform, arch].join('-');
};
