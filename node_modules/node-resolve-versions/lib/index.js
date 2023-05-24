var NodeSemvers = require('node-semvers');
var resolveVersions = require('./resolveVersions');

module.exports = function nodeResolveVersions(versionDetails, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof callback === 'function') {
    return NodeSemvers.load(function (err, semvers) {
      if (err) return callback(err);
      try {
        var version = resolveVersions(semvers, versionDetails, options || {});
        callback(null, version);
      } catch (err) {
        callback(err);
      }
    });
  }
  return new Promise(function (resolve, reject) {
    nodeResolveVersions(versionDetails, options, function (err, result) {
      err ? reject(err) : resolve(result);
    });
  });
};

module.exports.sync = function nodeResolveVersionsSync(versionDetails, options) {
  var semvers = NodeSemvers.loadSync();
  return resolveVersions(semvers, versionDetails, options || {});
};
