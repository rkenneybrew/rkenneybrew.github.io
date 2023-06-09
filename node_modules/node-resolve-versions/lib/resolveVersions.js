var uniq = require('lodash.uniq');

var resolveExpression = require('./resolveExpression');
var sortFunction = require('./sortFunction');

module.exports = function resolveVersions(semvers, versionDetails, options) {
  if (versionDetails === null || versionDetails === undefined) throw new Error('versionDetails missing');
  if (typeof versionDetails === 'number') versionDetails = '' + versionDetails;
  if (typeof versionDetails === 'string') {
    var results = [];
    var expressions = versionDetails.split(',');
    for (var index = 0; index < expressions.length; index++) {
      var versions = resolveExpression(expressions[index], semvers, options);
      Array.prototype.push.apply(results, versions);
    }
    return uniq(results).sort(sortFunction(options));
  }
  if (!versionDetails.version || !versionDetails.files) throw new Error('Unrecognized version details object: ' + JSON.stringify(versionDetails));
  return options.path === 'raw' ? [versionDetails] : [versionDetails.version];
};
