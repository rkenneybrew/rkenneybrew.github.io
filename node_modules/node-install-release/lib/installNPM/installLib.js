var path = require('path');
var match = require('match-semver');
var find = require('lodash.find');
var get = require('get-remote');

var conditionalCache = require('../conditionalCache');
var conditionalExtract = require('../conditionalExtract');
var npmVersions = require('./npmVersions');

var DIST_URL = 'https://registry.npmjs.org/npm';

module.exports = function installLib(version, dest, options, callback) {
  var platform = options.platform || process.platform;
  var maximumVersion = find(npmVersions, match.bind(null, version.version)).maximum;
  var libPath = platform === 'win32' ? dest : path.join(dest, 'lib');
  var installPath = path.join(libPath, 'node_modules', 'npm');

  get(DIST_URL).json(function (err, res) {
    if (err) return callback(err);

    var installVersion = res.body['dist-tags'][maximumVersion ? 'latest-' + maximumVersion : 'latest'];
    var downloadPath = DIST_URL + '/-/npm-' + installVersion + '.tgz';
    var cachePath = path.join(options.cacheDirectory, path.basename(downloadPath));
    conditionalCache(downloadPath, cachePath, function (err) {
      if (err) return callback(err);
      conditionalExtract(cachePath, installPath, callback);
    });
  });
};
