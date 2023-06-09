var path = require('path');
var assign = require('just-extend');
var Queue = require('queue-cb');
var installRelease = require('node-install-release');
var versionUtils = require('node-version-utils');
var resolveVersions = require('node-resolve-versions');

var constants = require('./constants');
var spawnKeys = ['encoding', 'stdio', 'stdin', 'stdout', 'stderr', 'cwd', 'env'];

module.exports = function use(versionExpression, command, args, options, callback) {
  resolveVersions(versionExpression, assign({}, options, { path: 'raw' }), function (err, versions) {
    if (err) return callback(err);
    if (!versions.length) return callback(new Error('No versions found from expression: ' + versionExpression));

    var spawnOptions = {};
    for (var i = 0; i < spawnKeys.length; i++) {
      if (options[spawnKeys[i]] !== undefined) spawnOptions[spawnKeys[i]] = options[spawnKeys[i]];
    }

    var results = [];
    var queue = new Queue(1);
    for (var index = 0; index < versions.length; index++) {
      (function (version) {
        queue.defer(function (callback) {
          !options.header || options.header(version.version, command, args);

          var installDirectory = options.installDirectory || constants.installDirectory;
          var cacheDirectory = options.cacheDirectory || constants.cacheDirectory;
          var installPath = path.join(installDirectory, version.version);

          installRelease(version, installPath, { cacheDirectory: cacheDirectory }, function (err) {
            if (err) return callback(err);

            versionUtils.spawn(installPath, command, args, spawnOptions, function (err, res) {
              results.push({ version: version.version, error: err, result: res });
              callback();
            });
          });
        });
      })(versions[index]);
    }
    queue.await(function (err) {
      err ? callback(err) : callback(null, results);
    });
  });
};
