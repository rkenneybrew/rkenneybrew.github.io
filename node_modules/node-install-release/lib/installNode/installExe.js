var path = require('path');

var conditionalCache = require('../conditionalCache');
var copyFile = require('../copyFile');
var access = require('fs-access-compat');

module.exports = function installExe(relativePath, dest, record, options, callback) {
  var downloadPath = options.downloadURL(relativePath);
  var cachePath = path.join(options.cacheDirectory, 'node' + '-' + record.version + '.exe');
  var destPath = path.join(dest, path.basename(relativePath));

  access(destPath, function (err) {
    if (!err) return callback(); // already exists
    conditionalCache(downloadPath, cachePath, function (err) {
      if (err) return callback(err);
      copyFile(cachePath, destPath, callback);
    });
  });
};
