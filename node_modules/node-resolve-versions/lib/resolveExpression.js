var path = require('path');
var isArray = require('isarray');

module.exports = function resolveExpression(key, semvers, options) {
  key = key.trim();
  if (key === 'engines') {
    var fullPath = path.join(options.cwd || process.cwd(), 'package.json');
    var pkg = require(fullPath);
    if (typeof pkg.engines === 'undefined') throw new Error('Engines not found in ' + fullPath);
    if (typeof pkg.engines.node === 'undefined') throw new Error('Engines node not found in ' + fullPath);
    return resolveExpression(pkg.engines.node, semvers, options);
  } else {
    var version = semvers.resolve(key, options);
    if (!version || (isArray(version) && !version.length)) throw new Error('Unrecognized version ' + key);
    return isArray(version) ? version : [version];
  }
};
