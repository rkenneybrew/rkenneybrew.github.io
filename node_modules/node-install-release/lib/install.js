var path = require('path');
var Queue = require('queue-cb');
var mkpath = require('mkpath');

var resolveVersions = require('node-resolve-versions');

var installVersion = require('./installVersion');

var NIR_DIR = path.join(require('osenv').home(), '.nir');
var DEFAULT_OPTIONS = {
  cacheDirectory: path.join(NIR_DIR, 'cache'),
  buildDirectory: path.join(NIR_DIR, 'build'),
  downloadURL: function downloadURL(relativePath) {
    return 'https://nodejs.org/dist/' + relativePath;
  },
};

module.exports = function install(versionDetails, dest, options, callback) {
  options = Object.assign({}, DEFAULT_OPTIONS, options, { path: 'raw' });
  resolveVersions(versionDetails, options, function (err, versions) {
    if (err) return callback(err);
    if (!versions.length) return callback(new Error('Could not resolve versions for: ' + JSON.stringify(versionDetails)));

    var results = [];
    var queue = new Queue(1);
    queue.defer(function (callback) {
      mkpath(options.cacheDirectory, callback.bind(null, null));
    });
    for (var index = 0; index < versions.length; index++) {
      (function (version) {
        queue.defer(function (callback) {
          var installDirectory = dest && versions.length > 1 ? path.join(dest, version.version) : dest;
          installVersion(version, installDirectory, options, function (err, fullPath) {
            if (err) return callback(err);
            results.push({ version: version.version, error: err, fullPath: fullPath });
            callback();
          });
        });
      })(versions[index]);
    }
    queue.await(function (err) {
      err ? callback(err) : callback(null, results);
    });
  });
};
