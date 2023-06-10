var use = require('./use');
var constants = require('./constants');

module.exports = function nodeVersionUse(versionExpression, command, args, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (typeof callback === 'function') return use(versionExpression, command, args, options || {}, callback);
  return new Promise(function (resolve, reject) {
    nodeVersionUse(versionExpression, command, args, options, function nodeVersionUseCallback(err, res) {
      err ? reject(err) : resolve(res);
    });
  });
};

module.exports.installDirectory = function installDirectory() {
  return constants.installDirectory;
};

module.exports.cacheDirectory = function cacheDirectory(options) {
  return constants.cacheDirectory;
};
