var path = require('path');
var Queue = require('queue-cb');

var conditionalCache = require('../../conditionalCache');
var conditionalExtract = require('../../conditionalExtract');
var buildPosix = require('./buildPosix');
var buildWin32 = require('./buildWin32');

module.exports = function InstallSource(relativePath, dest, record, options, callback) {
  var platform = options.platform || process.platform;
  var build = platform === 'win32' ? buildWin32 : buildPosix;
  var downloadPath = options.downloadURL(relativePath);
  var buildPath = path.join(options.buildDirectory, path.basename(relativePath));
  var cachePath = path.join(options.cacheDirectory, path.basename(downloadPath));

  var queue = new Queue(1);
  queue.defer(conditionalCache.bind(null, downloadPath, cachePath));
  queue.defer(conditionalExtract.bind(null, cachePath, buildPath, { strip: 1 }));
  queue.defer(build.bind(null, buildPath, dest, options));
  queue.await(callback);
};
